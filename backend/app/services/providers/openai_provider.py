import httpx

from app.config import settings
from app.services.ai.messages import AIMessage
from app.services.providers.base_provider import BaseAIProvider


class OpenAIProvider(BaseAIProvider):
    name = "openai"

    async def generate_response(self, messages: list[AIMessage]) -> str:
        if not settings.openai_api_key:
            return "OpenAI API key is not configured. Add OPENAI_API_KEY to backend/.env."

        payload = {
            "model": settings.openai_model,
            "messages": [message.model_dump() for message in messages],
            "temperature": 0.75,
        }
        headers = {"Authorization": f"Bearer {settings.openai_api_key}"}

        async with httpx.AsyncClient(timeout=settings.request_timeout_seconds) as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                json=payload,
                headers=headers,
            )
            response.raise_for_status()
            data = response.json()

        return data["choices"][0]["message"]["content"]
