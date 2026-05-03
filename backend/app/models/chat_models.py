from __future__ import annotations

from pydantic import BaseModel, Field

from app.schemas.tutor import LearnerProfile, TutorChatRequest, TutorChatResponse


class SmartChatRequest(BaseModel):
    user_id: str = Field(min_length=1)
    message: str = Field(min_length=1, max_length=4000)
    persona_id: str = "jarq_classic"
    course_id: str | None = None
    lesson_id: str | None = None


class JARQChatResponse(BaseModel):
    text: str
    emotion: str
    tone: str
    action: str
    lesson_suggestion: str | None = None
    mini_task: str | None = None


class SmartChatResponse(BaseModel):
    user_message: str
    jarq: JARQChatResponse


__all__ = [
    "JARQChatResponse",
    "LearnerProfile",
    "SmartChatRequest",
    "SmartChatResponse",
    "TutorChatRequest",
    "TutorChatResponse",
]
