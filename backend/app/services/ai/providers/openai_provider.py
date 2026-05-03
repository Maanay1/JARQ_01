import httpx

from app.core.config import settings
from app.services.ai.base import AIProvider
from app.services.ai.messages import AICompletion, AIMessage


class OpenAIProvider(AIProvider):
    name = "openai"

    def __init__(self) -> None:
        self.model = settings.openai_model

    async def complete(self, messages: list[AIMessage]) -> AICompletion:
        if not settings.openai_api_key:
            return AICompletion(
                content="OpenAI API key is not configured. Add OPENAI_API_KEY to backend/.env.",
                provider=self.name,
                model=self.model,
            )

        payload = {
            "model": self.model,
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

        return AICompletion(
            content=data["choices"][0]["message"]["content"],
            provider=self.name,
            model=self.model,
        )
