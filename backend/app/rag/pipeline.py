import re

# Rewrite follow-up questions so they contain enough context
# for the vector search.
from app.rag.query_rewriter import rewrite_query

# Search PostgreSQL/pgvector for relevant PDF chunks.
from app.rag.retrieval import retrieve_relevant_chunks

# Build the final prompt containing the instructions,
# conversation history, retrieved PDF context, and question.
from app.rag.prompt import build_rag_prompt

# Send the prompt to Ollama and generate the AI answer.
from app.rag.llm import generate_text


# This is the answer returned when the system cannot
# find enough information to answer the question.
FALLBACK = "Information not found."


def valid_citation(answer: str, count: int) -> bool:
    """
    Check whether the AI answer contains at least one
    valid [Source X] citation.
    """

    # Search the answer for citations such as:
    #
    # [Source 1]
    # [Source 2]
    # [Source 3]
    #
    # re.findall() returns only the number inside
    # the citation.
    #
    # Example:
    # "[Source 1] and [Source 3]"
    #
    # becomes:
    # ["1", "3"]
    numbers = [
        int(x)
        for x in re.findall(
            r"\[Source\s+(\d+)\]",
            answer,
            flags=re.I,
        )
    ]

    # Check whether at least one citation number
    # is within the valid source range.
    #
    # If there are 5 retrieved chunks, valid citations
    # are:
    #
    # [Source 1]
    # [Source 2]
    # [Source 3]
    # [Source 4]
    # [Source 5]
    return any(1 <= n <= count for n in numbers)


def format_project_stacks(chunks: list[dict]) -> str | None:
    """Extract each project's description and adjacent TECHSTACK USED list."""
    project_lines: list[str] = []

    for source_index, chunk in enumerate(chunks, 1):
        blocks = re.split(r"(?m)^\s*\d+\.\s+", chunk["text"])

        for block in blocks[1:]:
            first_line = block.strip().splitlines()[0].strip()
            # The PDF uses an en dash between each project name and its
            # description. Unicode escapes make this robust to file encodings.
            title_parts = re.split(r"\s+[\u2013\u2014]\s+|\s+-\s+", first_line, maxsplit=1)
            project_name = title_parts[0].strip(" -*")

            stack_match = re.search(
                r"TECH\s*STACK\s*USED\s*:\s*(.*)",
                block,
                flags=re.I | re.S,
            )
            if not stack_match:
                continue

            # Keep the descriptor after the dash and any following description
            # text that appears before the project's TECHSTACK USED heading.
            description_parts = []
            if len(title_parts) > 1 and title_parts[1].strip():
                description_parts.append(title_parts[1].strip(" -*:."))
            description_lines = block[: stack_match.start()].splitlines()[1:]
            description_parts.extend(
                line.strip(" -*\t")
                for line in description_lines
                if line.strip(" -*\t")
            )
            description = re.sub(r"\s+", " ", " ".join(description_parts)).strip()

            stack_text = stack_match.group(1)
            technologies = [
                item.strip(" .;\n\r\t")
                for item in re.split(r",|\band\b", stack_text, flags=re.I)
                if item.strip(" .;\n\r\t")
            ]

            if technologies:
                project_line = f"- {project_name}"
                if description:
                    project_line += f"\n  About: {description}"
                project_line += (
                    f"\n  Tech stack: {', '.join(technologies)}"
                    f" [Source {source_index}]"
                )
                project_lines.append(project_line)

    if not project_lines:
        return None

    return "Projects, descriptions, and tech stacks:\n\n" + "\n\n".join(project_lines)


async def answer_question(
    question: str,
    messages: list[dict] | None = None,
):
    """
    Process a user's question through the complete
    RAG pipeline and return the final answer.
    """

    # If no conversation history was provided,
    # use an empty list instead of None.
    #
    # This makes it easier to work with messages later.
    messages = messages or []

    # Greetings are conversational and do not need a PDF search or an LLM call.
    # Use a full match so a real question such as "Hi, what projects..." still
    # continues through the normal RAG pipeline.
    # Normalize punctuation between greeting words too, so phrases like
    # "Hi! Can I ask?" match the greeting rule below.
    normalized_question = re.sub(
        r"[!?.\s]+",
        " ",
        question.strip().casefold(),
    ).strip()
    if re.fullmatch(
        r"(?:hi|hello|hey)(?:\s+yumi)?(?:\s+(?:can|may)\s+i\s+ask(?:\s+you)?|\s+i\s+have\s+a\s+question)?|"
        r"good\s+(?:morning|afternoon|evening)(?:\s+(?:can|may)\s+i\s+ask(?:\s+you)?)?",
        normalized_question,
    ):
        return {
            "answer": "Hi! I'm YUMI. Of course, ask me about Kemuel's projects, skills, or experience.",
            "sources": [],
        }
    if re.fullmatch(
        r"(?:thank\s+you|thanks|thx)(?:\s+(?:yumi|so\s+much|a\s+lot))?",
        normalized_question,
    ):
        return {
            "answer": "You’re welcome! Feel free to ask if you’d like to know more.",
            "sources": [],
        }

    # ---------------------------------------------------------
    # STEP 1: Rewrite the user's question
    # ---------------------------------------------------------
    #
    # This is especially useful for follow-up questions.
    #
    # Example:
    #
    # Previous:
    # "What is Sellio?"
    #
    # User:
    # "What are its features?"
    #
    # rewrite_query() can add the previous question
    # so retrieval has more context.
    search_query = rewrite_query(
        question,
        messages,
    )

    asks_for_project_list = bool(
        re.search(
            r"\b(?:list|name|which|what|all)\b.*\bprojects?\b|"
            r"\bprojects?\b.*\b(?:all|list|names?)\b",
            question,
            re.I,
        )
    )
    asks_for_project_stacks = asks_for_project_list and bool(
        re.search(
            r"\b(?:tech(?:nology)?\s*stack|stacks?|technologies)\b",
            question,
            re.I,
        )
    )
    if asks_for_project_list:
        # Match the document's explicit project heading and its project names.
        # This helps retrieve the projects page instead of the general overview.
        search_query = (
            "PROJECTS list of all project names and descriptions: "
            "EventSphere, Social Welfare System, ECA-IS"
        )

    # A broad tech-stack question should find the portfolio overview section,
    # rather than one project's individual stack. Project-specific questions
    # keep their original query so retrieval can focus on that project.
    asks_for_general_stack = bool(
        re.search(r"\b(?:tech(?:nology)?\s*stack|technologies)\b", question, re.I)
    )
    mentions_a_project = bool(
        re.search(
            r"\b(?:project|eventsphere|social welfare system|eca\s*[-\u2013\u2014]?\s*is|internship)\b",
            question,
            re.I,
        )
    )
    if asks_for_general_stack and not mentions_a_project and not asks_for_project_list:
        search_query = (
            "portfolio-wide technology stack overview: Frontend Development, "
            "Backend Development, Databases, Cloud and Hosting, DevOps and "
            "Deployment, and UI/UX Design"
        )


    # ---------------------------------------------------------
    # STEP 2: Search for relevant PDF chunks
    # ---------------------------------------------------------
    #
    # The rewritten question is converted into an embedding
    # inside retrieve_relevant_chunks().
    #
    # PostgreSQL + pgvector then searches for similar
    # chunks from the uploaded PDF.
    #
    # limit=5:
    # Return at most 5 relevant chunks.
    #
    # max_distance=0.65:
    # Only accept chunks whose vector distance is
    # 0.65 or lower.
    chunks = retrieve_relevant_chunks(
        search_query,
        limit=5,
        max_distance=0.65,
    )

    # When the matching section is present, pass only that section to the
    # model. Similar pages can otherwise make it mix the overview with
    # project-specific stacks, or answer a project-list question from page 1.
    if asks_for_project_list:
        project_section = [
            chunk
            for chunk in chunks
            if re.search(r"\bPROJECTS\s*:", chunk["text"], re.I)
        ]
        if project_section:
            chunks = project_section
    elif asks_for_general_stack and not mentions_a_project:
        stack_overview = [
            chunk
            for chunk in chunks
            if re.search(r"\bTECH\s*STACKS\b", chunk["text"], re.I)
        ]
        if stack_overview:
            chunks = stack_overview


    # ---------------------------------------------------------
    # STEP 3: Check whether anything relevant was found
    # ---------------------------------------------------------
    #
    # If PostgreSQL did not find any relevant chunks,
    # there is no reliable PDF information to give
    # to the AI.
    if not chunks:
        return {
            "answer": FALLBACK,
            "sources": [],
        }

    if asks_for_project_stacks:
        structured_answer = format_project_stacks(chunks)
        if structured_answer:
            return {
                "answer": structured_answer,
                "sources": chunks,
            }


    # ---------------------------------------------------------
    # STEP 4: Build the RAG prompt
    # ---------------------------------------------------------
    #
    # This combines:
    #
    # - the user's original question
    # - retrieved PDF chunks
    # - conversation history
    # - instructions for YUMI
    # - source citation requirements
    #
    # Notice that we use the ORIGINAL question here,
    # not search_query.
    #
    # search_query is mainly for better retrieval.
    # The original question is what we want YUMI
    # to actually answer.
    prompt = build_rag_prompt(
        question,
        chunks,
        messages,
    )


    # ---------------------------------------------------------
    # STEP 5: Send the prompt to Ollama
    # ---------------------------------------------------------
    #
    # generate_text() sends the prompt to the local
    # Ollama model and returns the generated answer.
    answer = await generate_text(prompt)


    # ---------------------------------------------------------
    # STEP 6: Validate the AI response
    # ---------------------------------------------------------
    #
    # Keep the fallback only when the model returned no answer or explicitly
    # said the retrieved context does not contain the answer. If it answers
    # without a valid citation, add the top-ranked source below.
    answer = answer.strip()
    if (
        not answer
        or answer.rstrip(".! ").casefold()
        == FALLBACK.rstrip(".! ").casefold()
    ):
        return {
            "answer": FALLBACK,
            "sources": chunks,
        }

    # Source 1 is the closest matching chunk in the context. Small local
    # models sometimes answer from the supplied context but omit the citation;
    # add the top-ranked source instead of discarding an otherwise useful answer.
    if not valid_citation(answer, len(chunks)):
        answer = re.sub(
            r"\[Source\s+\d+\]",
            "",
            answer,
            flags=re.I,
        ).strip()
        answer = f"{answer} [Source 1]"


    # ---------------------------------------------------------
    # STEP 7: Return the final successful response
    # ---------------------------------------------------------
    #
    # The answer is the text generated by Ollama.
    #
    # sources contains the retrieved PDF chunks so
    # the frontend can display source information.
    return {
        "answer": answer,
        "sources": chunks,
    }
