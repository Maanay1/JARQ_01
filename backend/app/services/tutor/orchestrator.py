from __future__ import annotations

from app.schemas.tutor import TutorChatRequest, TutorChatResponse
from app.services.ai.factory import get_ai_provider
from app.services.memory.repository import MemoryRepository
from app.services.tutor.personas import get_persona
from app.services.tutor.prompts import build_tutor_messages


class TutorOrchestrator:
    def __init__(self, memory_repository: MemoryRepository | None = None) -> None:
        self.memory_repository = memory_repository or MemoryRepository()

    async def chat(self, request: TutorChatRequest) -> TutorChatResponse:
        persona = get_persona(request.persona_id)
        memories = []
        if request.include_memory:
            memories = await self.memory_repository.list_recent(request.learner.user_id)

        provider = get_ai_provider(request.provider)
        completion = await provider.complete(build_tutor_messages(request, persona, memories))

        # Keep memory extraction conservative until a dedicated classifier is added.
        if "remember:" in request.message.lower():
            memory = request.message.split(":", 1)[-1].strip()
            await self.memory_repository.add(request.learner.user_id, memory, importance=2)

        return TutorChatResponse(
            reply=completion.content,
            provider=completion.provider,
            persona_id=persona.id,
            memory_used=memories,
            suggested_next_steps=[
                "Practice one short answer aloud.",
                "Ask JARQ to explain one mistake.",
            ],
        )


def get_tutor_orchestrator() -> TutorOrchestrator:
    return TutorOrchestrator()
