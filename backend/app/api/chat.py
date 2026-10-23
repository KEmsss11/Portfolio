from fastapi import APIRouter
from pydantic import BaseModel

# Import the main RAG pipeline.
#
# answer_question() handles:
# - query rewriting
# - PDF retrieval
# - prompt building
# - Ollama generation
# - citation validation
from app.rag.pipeline import answer_question


# Create a FastAPI router.
#
# This router will contain the API endpoints
# related to the chatbot.
router = APIRouter()


class ChatMessage(BaseModel):
    """
    Represents one message in the conversation history.
    """

    # The role tells us who sent the message.
    #
    # Examples:
    # "user"
    # "assistant"
    role: str

    # The actual message content.
    content: str


class ChatRequest(BaseModel):
    """
    Represents the data that the frontend sends
    when asking YUMI a question.
    """

    # The user's current question.
    question: str

    # Previous conversation messages.
    #
    # Example:
    #
    # [
    #     {
    #         "role": "user",
    #         "content": "What is Sellio?"
    #     },
    #     {
    #         "role": "assistant",
    #         "content": "Sellio is..."
    #     }
    # ]
    #
    # If the frontend does not provide messages,
    # an empty list is used.
    messages: list[ChatMessage] = []


@router.post("/chat")
async def chat(request: ChatRequest):
    """
    Handle a chatbot request from the frontend.
    """

    # Send the user's question and conversation history
    # to the main RAG pipeline.
    #
    # request.question:
    #     The user's current question.
    #
    # request.messages:
    #     Previous conversation messages.
    #
    # m.model_dump():
    #     Converts each Pydantic ChatMessage object
    #     into a normal Python dictionary.
    return await answer_question(
        request.question,
        [
            m.model_dump()
            for m in request.messages
        ],
    )