import os
import httpx
from dotenv import load_dotenv


# Load variables from the .env file.
#
# This allows us to store settings such as:
# OLLAMA_HOST=http://localhost:11434
# OLLAMA_MODEL=llama3.2:1b
load_dotenv()


# Get the Ollama server address from the .env file.
#
# If OLLAMA_HOST is not found,
# use http://localhost:11434 as the default.
OLLAMA_HOST = os.getenv(
    "OLLAMA_HOST",
    "http://localhost:11434",
)


# Get the AI model name from the .env file.
#
# If OLLAMA_MODEL is not found,
# use llama3.2:1b as the default model.
MODEL = os.getenv(
    "OLLAMA_MODEL",
    "llama3.2:1b",
)


async def generate_text(prompt: str) -> str:
    """
    Send a prompt to the Ollama AI model
    and return the generated answer.
    """

    # Create an asynchronous HTTP client.
    #
    # AsyncClient allows our application to communicate
    # with Ollama without blocking the entire application
    # while waiting for the AI response.
    #
    # Leave room for FastAPI to return an error before the Next.js proxy
    # times out. Model loading is warmed separately during setup/startup.
    timeout = httpx.Timeout(210.0, connect=10.0)
    async with httpx.AsyncClient(timeout=timeout) as client:

        # Send a POST request to Ollama's chat API.
        #
        # /api/chat is Ollama's endpoint for chat-based
        # text generation.
        response = await client.post(
            f"{OLLAMA_HOST}/api/chat",

            # Send the model and conversation to Ollama.
            json={
                # Tell Ollama which model should generate
                # the response.
                "model": MODEL,

                # Provide the prompt as a user message.
                #
                # The prompt here will normally be the
                # RAG prompt created by build_rag_prompt().
                "messages": [
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],

                # We want one complete response instead
                # of receiving the answer piece-by-piece.
                "stream": False,

                # Additional settings for the model.
                "options": {

                    # A smaller context is faster on CPU and sufficient
                    # for the question plus the retrieved PDF chunks.
                    "num_ctx": 4096,

                    # Keep answers concise so CPU generation completes sooner.
                    "num_predict": 128,
                },
                # Keep the small local model loaded until Ollama restarts,
                # avoiding multi-minute cold starts after idle periods.
                "keep_alive": -1,
            },
        )

        # Raise an exception if Ollama returned an HTTP error.
        #
        # For example:
        # 404 -> endpoint/model problem
        # 500 -> server-side problem
        response.raise_for_status()

        # Convert Ollama's JSON response into a Python dictionary.
        #
        # Then access:
        # response -> message -> content
        #
        # .strip() removes unnecessary whitespace
        # from the beginning and end of the answer.
        return response.json()["message"]["content"].strip()
