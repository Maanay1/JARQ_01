from abc import ABC, abstractmethod

from app.services.ai.messages import AIMessage


class BaseAIProvider(ABC):
    name: str

    @abstractmethod
    async def generate_response(self, messages: list[AIMessage]) -> str:
        """Generate a text response from a chat-style message list."""
