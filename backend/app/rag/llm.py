import os

import httpx
from dotenv import load_dotenv

load_dotenv()

ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")
MODEL = os.getenv(
    "CLOUDFLARE_AI_MODEL",
    "@cf/zai-org/glm-4.7-flash",
)


async def generate_text(prompt: str) -> str:
    if not ACCOUNT_ID or not API_TOKEN:
        raise RuntimeError("Cloudflare Workers AI credentials are not configured.")

    url = (
        f"https://api.cloudflare.com/client/v4/accounts/"
        f"{ACCOUNT_ID}/ai/v1/chat/completions"
    )

    async with httpx.AsyncClient(timeout=90.0) as client:
        response = await client.post(
            url,
            headers={"Authorization": f"Bearer {API_TOKEN}"},
            json={
                "model": MODEL,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 256,
            },
        )
        response.raise_for_status()
        data = response.json()

    answer = data["choices"][0]["message"]["content"]
    return answer.strip()