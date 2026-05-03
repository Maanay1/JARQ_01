from __future__ import annotations

from pydantic import BaseModel, Field


class CourseResponse(BaseModel):
    id: str
    title: str
    description: str | None = None
    subject: str | None = None
    level: str | None = None


class TaskResponse(BaseModel):
    id: str
    lesson_id: str
    type: str | None = None
    question: str
    correct_answer: str | None = None
    explanation: str | None = None
    difficulty: str | None = None


class LessonResponse(BaseModel):
    id: str
    course_id: str | None = None
    title: str
    content: str | None = None
    order_index: int = 0
    tasks: list[TaskResponse] = Field(default_factory=list)


class CheckAnswerRequest(BaseModel):
    user_id: str = Field(min_length=1)
    task_id: str = Field(min_length=1)
    answer: str = Field(min_length=1)


class CheckAnswerResponse(BaseModel):
    correct: bool
    feedback: str
    emotion: str
    xp_earned: int
    explanation: str
    next_task: TaskResponse | None = None


class LessonStep(BaseModel):
    id: str
    title: str
    instruction: str
    expected_minutes: int = 3


class LessonPlanRequest(BaseModel):
    user_id: str
    topic: str = Field(min_length=1)
    level: str = "beginner"
    target_language: str = "English"


class LessonPlanResponse(BaseModel):
    lesson_id: str
    title: str
    steps: list[LessonStep]
    status: str = "stub"
