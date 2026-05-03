from fastapi import APIRouter, Depends

from app.models.lesson_models import (
    CheckAnswerRequest,
    CheckAnswerResponse,
    CourseResponse,
    LessonPlanRequest,
    LessonPlanResponse,
    LessonResponse,
)
from app.services.lesson_service import LessonService, get_lesson_service

router = APIRouter(tags=["lessons"])


@router.get("/courses", response_model=list[CourseResponse])
async def list_courses(
    lesson_service: LessonService = Depends(get_lesson_service),
) -> list[CourseResponse]:
    return await lesson_service.list_courses()


@router.get("/courses/{course_id}/lessons", response_model=list[LessonResponse])
async def list_course_lessons(
    course_id: str,
    lesson_service: LessonService = Depends(get_lesson_service),
) -> list[LessonResponse]:
    return await lesson_service.list_course_lessons(course_id)


@router.get("/lessons/{lesson_id}", response_model=LessonResponse)
async def get_lesson(
    lesson_id: str,
    lesson_service: LessonService = Depends(get_lesson_service),
) -> LessonResponse:
    return await lesson_service.get_lesson(lesson_id)


@router.post("/lessons/{lesson_id}/check-answer", response_model=CheckAnswerResponse)
async def check_answer(
    lesson_id: str,
    request: CheckAnswerRequest,
    lesson_service: LessonService = Depends(get_lesson_service),
) -> CheckAnswerResponse:
    return await lesson_service.check_answer(lesson_id, request)


@router.post("/lessons/plan", response_model=LessonPlanResponse)
async def create_lesson_plan(
    request: LessonPlanRequest,
    lesson_service: LessonService = Depends(get_lesson_service),
) -> LessonPlanResponse:
    return await lesson_service.create_plan(request)
