def build_rag_prompt(
    question: str,
    chunks: list[dict],
    history: list[dict] | None = None,
) -> str:
    # If no relevant PDF chunks were found,
    # immediately tell the chatbot to return this exact answer.
    if not chunks:
        return "Answer exactly: Information not found."

    # This list will contain the formatted information
    # retrieved from the PDF.
    context = []

    # Loop through every retrieved chunk.
    #
    # enumerate(..., 1) means the numbering starts at 1
    # instead of 0. This gives us:
    # Source 1, Source 2, Source 3, etc.
    for index, chunk in enumerate(chunks, 1):

        # Format each retrieved chunk so the AI knows:
        # - which source it came from
        # - which PDF file it came from
        # - which page it came from
        # - the actual text of the chunk
        context.append(
            f"[Source {index}] "
            f"File: {chunk['file_name']}; "
            f"Page: {chunk['page']}\n"
            f"{chunk['text']}"
        )

    # Start with an empty conversation history.
    history_text = ""

    # Only process the history if conversation messages exist.
    if history:

        # Take only the last 6 messages.
        #
        # history[-6:] means:
        # "Give me the most recent 6 messages."
        #
        # This prevents the prompt from becoming unnecessarily
        # large when the conversation gets longer.
        history_text = "\n".join(
            f"{m['role']}: {m['content']}"
            for m in history[-6:]
        )

    # Build the final prompt that will be sent to the AI model.
    return f"""
You are YUMI a AI Helpdesk, a document question-answering assistant.


# Instructions

- Use only the supplied context.
- Do not invent facts.
- Be polite, warm, and direct. Answer the question first without a long preamble.
- Organize the reply for easy reading: use short paragraphs, and leave a blank
  line between separate ideas.
- For multiple projects, skills, or technologies, use a clear bullet list with
  one item per line. Keep each project and its details together.
- Avoid repeating the question, adding unsupported conclusions, or combining
  unrelated facts into one paragraph.
- Treat short fragments as direct questions. For example, "Tech stack" means
  "What technologies are used?"
- If the context contains the answer, answer directly and cite it at the end
  using the exact label shown in the context, such as [Source 1].
- Keep the reply concise. Do not start with phrases like "For the question" or
  "The explicitly named items are".
- For a question about technologies or a tech stack, list the technologies
  explicitly named in the context.
- For a broad portfolio tech-stack question, prefer the portfolio-wide
  "TECH STACKS" overview over stacks listed under individual projects.
- Group technologies by category, remove duplicates, and do not list connector
  words such as "and" as technologies.
- When asked to list projects, use the "PROJECTS" section and include every
  project name stated there. Do not refuse if the retrieved context lists them.
- For a list, use one bullet per distinct item, omit duplicates, and keep the
  wording parallel across items.
- If the context does not support the answer, return exactly:
  Information not found.

# Conversation

{history_text}

# Retrieved Context

{"\n\n".join(context)}

# Question

{question}

# Answer

""".strip()
