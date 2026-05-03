import httpx

from app.core.config import settings
from app.services.ai.base import AIProvider
from app.services.ai.messages import AICompletion, AIMessage


class GeminiProvider(AIProvider):
    name = "gemini"

    def __init__(self) -> None:
        self.model = settings.gemini_model

    async def complete(self, messages: list[AIMessage]) -> AICompletion:
        if not settings.gemini_api_key:
            return AICompletion(
                content="Gemini API key is not configured. Add GEMINI_API_KEY to backend/.env.",
                provider=self.name,
                model=self.model,
            )

        prompt = "\n\n".join(f"{message.role.upper()}: {message.content}" for message in messages)
        url = (
            "https://generativelanguage.googleapis.com/v1beta/"
            f"models/{self.model}:generateContent?key={settings.gemini_api_key}"
        )
        payload = {"contents": [{"parts": [{"text": prompt}]}]}

        async with httpx.AsyncClient(timeout=settings.request_timeout_seconds) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()

        text = data["candidates"][0]["content"]["parts"][0]["text"]
        return AICompletion(content=text, provider=self.name, model=self.model)
