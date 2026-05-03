import httpx

from app.core.config import settings
from app.services.ai.base import AIProvider
from app.services.ai.messages import AICompletion, AIMessage


class OllamaProvider(AIProvider):
    name = "ollama"

    def __init__(self) -> None:
        self.model = settings.ollama_model

    async def complete(self, messages: list[AIMessage]) -> AICompletion:
        payload = {
            "model": self.model,
            "messages": [message.model_dump() for message in messages],
            "stream": False,
        }

        async with httpx.AsyncClient(timeout=settings.request_timeout_seconds) as client:
            response = await client.post(f"{settings.ollama_base_url}/api/chat", json=payload)
            response.raise_for_status()
            data = response.json()

        return AICompletion(
            content=data["message"]["content"],
            provider=self.name,
            model=self.model,
        )
