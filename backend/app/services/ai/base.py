from abc import ABC, abstractmethod

from app.services.ai.messages import AICompletion, AIMessage


class AIProvider(ABC):
    name: str

    @abstractmethod
    async def complete(self, messages: list[AIMessage]) -> AICompletion:
        """Return a chat completion from the provider."""
