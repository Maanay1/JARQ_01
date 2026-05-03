from __future__ import annotations

from pydantic import BaseModel, Field


class LearnerProfile(BaseModel):
    user_id: str
    display_name: str | None = None
    level: str = "beginner"
    target_language: str = "English"
    native_language: str = "Russian"
    interests: list[str] = Field(default_factory=list)


class TutorChatRequest(BaseModel):
    learner: LearnerProfile
    message: str = Field(min_length=1, max_length=4000)
    lesson_id: str | None = None
    persona_id: str = "jarq_classic"
    provider: str | None = None
    include_memory: bool = True


class TutorChatResponse(BaseModel):
    reply: str
    provider: str
    persona_id: str
    memory_used: list[str] = Field(default_factory=list)
    suggested_next_steps: list[str] = Field(default_factory=list)
