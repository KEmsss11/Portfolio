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
                "max_completion_tokens": 1024,
            },
        )
        response.raise_for_status()
        data = response.json()

    choices = data.get("choices") or []
    message = choices[0].get("message") if choices else None
    answer = message.get("content") if message else None

    if not isinstance(answer, str) or not answer.strip():
        finish_reason = choices[0].get("finish_reason") if choices else "no choices"
        raise RuntimeError(
            f"Cloudflare returned no answer text. Finish reason: {finish_reason}"
        )

    return answer.strip()