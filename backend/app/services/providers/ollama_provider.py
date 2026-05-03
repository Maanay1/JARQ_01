import httpx

from app.config import settings
from app.services.ai.messages import AIMessage
from app.services.providers.base_provider import BaseAIProvider


class OllamaProvider(BaseAIProvider):
    name = "ollama"

    async def generate_response(self, messages: list[AIMessage]) -> str:
        payload = {
            "model": settings.ollama_model,
            "messages": [message.model_dump() for message in messages],
            "stream": False,
        }

        async with httpx.AsyncClient(timeout=settings.request_timeout_seconds) as client:
            response = await client.post(f"{settings.ollama_base_url}/api/chat", json=payload)
            response.raise_for_status()
            data = response.json()

        return data["message"]["content"]
