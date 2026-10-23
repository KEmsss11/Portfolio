import os

import httpx
from dotenv import load_dotenv

load_dotenv()

ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")
MODEL = "@cf/baai/bge-small-en-v1.5"


def create_embeddings(texts: list[str]) -> list[list[float]]:
    if not ACCOUNT_ID or not API_TOKEN:
        raise RuntimeError("Cloudflare Workers AI credentials are not configured.")

    url = (
        f"https://api.cloudflare.com/client/v4/accounts/"
        f"{ACCOUNT_ID}/ai/run/{MODEL}"
    )

    with httpx.Client(timeout=60.0) as client:
        response = client.post(
            url,
            headers={"Authorization": f"Bearer {API_TOKEN}"},
            json={"text": texts},
        )
        response.raise_for_status()
        data = response.json()

    return data["result"]["data"]


def create_embedding(text: str) -> list[float]:
    return create_embeddings([text])[0]