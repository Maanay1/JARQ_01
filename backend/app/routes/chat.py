from __future__ import annotations

from fastapi import APIRouter, Depends

from app.db.supabase import get_supabase_client
from app.models.chat_models import (
    JARQChatResponse,
    SmartChatRequest,
    SmartChatResponse,
    TutorChatRequest,
    TutorChatResponse,
)
from app.services.ai_service import AIService, get_ai_service
from app.services.memory.context import LearningContextService, get_learning_context
from app.services.persona_service import PersonaService, get_persona_service

router = APIRouter(tags=["chat"])


@router.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "jarq-ai-tutor"}


@router.post("/tutor/chat", response_model=TutorChatResponse)
async def chat_with_tutor(
    request: TutorChatRequest,
    ai_service: AIService = Depends(get_ai_service),
) -> TutorChatResponse:
    """Legacy chat endpoint kept for frontend compatibility."""

    return await ai_service.chat(request)


@router.post("/chat", response_model=SmartChatResponse)
async def chat(
    request: SmartChatRequest,
    ai_service: AIService = Depends(get_ai_service),
    persona_service: PersonaService = Depends(get_persona_service),
) -> SmartChatResponse:
    persona = persona_service.get_persona(request.persona_id)
    chat_history = await _get_user_chat_history(request.user_id)
    learning_context = await get_learning_context(
        user_id=request.user_id,
        course_id=request.course_id,
        lesson_id=request.lesson_id,
    )

    jarq_response = await ai_service.generate_response(
        user_message=request.message,
        persona=persona.model_dump(),
        chat_history=chat_history,
        learning_context=learning_context,
    )

    await _save_chat_turn(
        user_id=request.user_id,
        user_message=request.message,
        jarq_payload=jarq_response.model_dump(),
        persona_id=persona.id,
        course_id=request.course_id,
        lesson_id=request.lesson_id,
    )

    return SmartChatResponse(
        user_message=request.message,
        jarq=JARQChatResponse.model_validate(jarq_response.model_dump()),
    )


async def _get_user_chat_history(user_id: str, limit: int = 12) -> list[dict[str, str]]:
    return await LearningContextService().get_recent_chat_history(user_id, limit=limit)


async def _save_chat_turn(
    user_id: str,
    user_message: str,
    jarq_payload: dict[str, object],
    persona_id: str,
    course_id: str | None,
    lesson_id: str | None,
) -> None:
    client = get_supabase_client()
    if client is None:
        return

    memory_service = LearningContextService()
    await memory_service.save_chat_turn(
        user_id=user_id,
        user_message=user_message,
        ai_response=str(jarq_payload.get("text", "")),
        persona_id=persona_id,
        emotion=str(jarq_payload.get("emotion", "")),
    )
    await memory_service.remember_preferences(
        user_id=user_id,
        preferred_persona=persona_id,
        current_course=course_id,
    )
