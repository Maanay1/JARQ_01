from __future__ import annotations

from fastapi import HTTPException

from app.config import settings
from app.services.providers.base_provider import BaseAIProvider
from app.services.providers.gemini_provider import GeminiProvider
from app.services.providers.ollama_provider import OllamaProvider
from app.services.providers.openai_provider import OpenAIProvider


def get_provider(provider_name: str | None = None) -> BaseAIProvider:
    name = (provider_name or settings.ai_provider or settings.ai_default_provider).lower()
    providers: dict[str, BaseAIProvider] = {
        "openai": OpenAIProvider(),
        "gemini": GeminiProvider(),
        "ollama": OllamaProvider(),
    }

    if name not in providers:
        raise HTTPException(status_code=400, detail=f"Unsupported AI provider: {name}")

    return providers[name]
