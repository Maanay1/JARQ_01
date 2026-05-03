from __future__ import annotations

from pydantic import BaseModel, Field


class MistakeEvent(BaseModel):
    id: str
    user_id: str
    subject: str | None = None
    mistake: str
    correction: str | None = None
    explanation: str | None = None
    created_at: str | None = None


class UserProgressResponse(BaseModel):
    user_id: str
    level: int = 1
    xp: int = 0
    streak: int = 0
    completed_lessons: int = 0
    known_mistakes: int = 0
    weak_topics: list[str] = Field(default_factory=list)
    latest_mistakes: list[MistakeEvent] = Field(default_factory=list)
    jarq_recommendation: str = "Keep practicing a little every day. Small steps stack fast."


class XPUpdateRequest(BaseModel):
    amount: int = Field(default=10, ge=0)


class StreakUpdateRequest(BaseModel):
    increment: int = Field(default=1, ge=0)
