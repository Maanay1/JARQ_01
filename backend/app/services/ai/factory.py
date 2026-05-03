from __future__ import annotations

from fastapi import HTTPException

from app.core.config import settings
from app.services.ai.base import AIProvider
from app.services.ai.providers.gemini_provider import GeminiProvider
from app.services.ai.providers.ollama_provider import OllamaProvider
from app.services.ai.providers.openai_provider import OpenAIProvider
from app.services.ai.providers.openrouter_provider import OpenRouterProvider


def get_ai_provider(provider_name: str | None = None) -> AIProvider:
    name = (provider_name or settings.ai_default_provider).lower()
    providers: dict[str, AIProvider] = {
        "openai": OpenAIProvider(),
        "openrouter": OpenRouterProvider(),
        "gemini": GeminiProvider(),
        "ollama": OllamaProvider(),
    }

    if name not in providers:
        raise HTTPException(status_code=400, detail=f"Unsupported AI provider: {name}")

    return providers[name]
