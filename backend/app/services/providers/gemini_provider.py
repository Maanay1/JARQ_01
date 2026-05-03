import httpx

from app.config import settings
from app.services.ai.messages import AIMessage
from app.services.providers.base_provider import BaseAIProvider


class GeminiProvider(BaseAIProvider):
    name = "gemini"

    async def generate_response(self, messages: list[AIMessage]) -> str:
        if not settings.gemini_api_key:
            return "Gemini API key is not configured. Add GEMINI_API_KEY to backend/.env."

        prompt = "\n\n".join(f"{message.role.upper()}: {message.content}" for message in messages)
        url = (
            "https://generativelanguage.googleapis.com/v1beta/"
            f"models/{settings.gemini_model}:generateContent?key={settings.gemini_api_key}"
        )
        payload = {"contents": [{"parts": [{"text": prompt}]}]}

        async with httpx.AsyncClient(timeout=settings.request_timeout_seconds) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()

        return data["candidates"][0]["content"]["parts"][0]["text"]
