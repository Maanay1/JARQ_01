from __future__ import annotations

import re
from uuid import uuid4

from app.db.supabase import get_supabase_client
from app.models.lesson_models import (
    CheckAnswerRequest,
    CheckAnswerResponse,
    CourseResponse,
    LessonPlanRequest,
    LessonPlanResponse,
    LessonResponse,
    LessonStep,
    TaskResponse,
)
from app.services.ai_service import AIService


class LessonService:
    """Reads lessons, checks answers and updates learner progress."""

    def __init__(self, ai_service: AIService | None = None) -> None:
        self.client = get_supabase_client()
        self.ai_service = ai_service or AIService()

    async def create_plan(self, request: LessonPlanRequest) -> LessonPlanResponse:
        return LessonPlanResponse(
            lesson_id=str(uuid4()),
            title=f"{request.topic} practice",
            steps=[
                LessonStep(
                    id="warmup",
                    title="Warm up",
                    instruction="Answer one easy question about the topic.",
                ),
                LessonStep(
                    id="practice",
                    title="Guided practice",
                    instruction="Complete a short exercise with tutor feedback.",
                ),
                LessonStep(
                    id="recap",
                    title="Recap",
                    instruction="Review the main mistake and repeat the corrected phrase.",
                ),
            ],
        )

    async def list_courses(self) -> list[CourseResponse]:
        if self.client is None:
            return self._demo_courses()

        try:
            response = self.client.table("courses").select("id, title, description, subject, level").execute()
            courses = [CourseResponse.model_validate(row) for row in response.data or []]
            return courses or self._demo_courses()
        except Exception:
            return self._demo_courses()

    async def list_course_lessons(self, course_id: str) -> list[LessonResponse]:
        if self.client is None:
            return [lesson for lesson in self._demo_lessons() if lesson.course_id == course_id]

        try:
            response = (
                self.client.table("lessons")
                .select("id, course_id, title, content, order_index")
                .eq("course_id", course_id)
                .order("order_index")
                .execute()
            )
            lessons = [LessonResponse.model_validate(row) for row in response.data or []]
            return lessons or [lesson for lesson in self._demo_lessons() if lesson.course_id == course_id]
        except Exception:
            return [lesson for lesson in self._demo_lessons() if lesson.course_id == course_id]

    async def get_lesson(self, lesson_id: str) -> LessonResponse:
        if self.client is None:
            return self._find_demo_lesson(lesson_id)

        try:
            lesson_response = (
                self.client.table("lessons")
                .select("id, course_id, title, content, order_index")
                .eq("id", lesson_id)
                .limit(1)
                .execute()
            )
            if not lesson_response.data:
                return self._find_demo_lesson(lesson_id)

            lesson = LessonResponse.model_validate(lesson_response.data[0])
            tasks_response = self.client.table("tasks").select("*").eq("lesson_id", lesson_id).execute()
            lesson.tasks = [TaskResponse.model_validate(row) for row in tasks_response.data or []]
            return lesson
        except Exception:
            return self._find_demo_lesson(lesson_id)

    async def check_answer(self, lesson_id: str, request: CheckAnswerRequest) -> CheckAnswerResponse:
        lesson = await self.get_lesson(lesson_id)
        task = self._find_task(lesson, request.task_id)
        correct = self._normalize_answer(request.answer) == self._normalize_answer(task.correct_answer or "")

        if correct:
            xp_earned = 10
            feedback = "Верно. Отличная работа."
            explanation = task.explanation or "You chose the expected answer."
            emotion = "proud"
            await self._update_progress(request.user_id, lesson, completed=True, score=100)
        else:
            xp_earned = 0
            ai_feedback = await self._explain_mistake(request.answer, task)
            feedback = ai_feedback.text
            explanation = task.explanation or ai_feedback.text
            emotion = ai_feedback.emotion
            await self._save_mistake(request.user_id, lesson, task, request.answer, explanation)
            await self._update_progress(request.user_id, lesson, completed=False, score=0)

        return CheckAnswerResponse(
            correct=correct,
            feedback=feedback,
            emotion=emotion,
            xp_earned=xp_earned,
            explanation=explanation,
            next_task=self._next_task(lesson, task.id),
        )

    def _normalize_answer(self, value: str) -> str:
        normalized = re.sub(r"\s+", " ", value.strip().lower())
        return re.sub(r";+\s*$", "", normalized)

    def _find_task(self, lesson: LessonResponse, task_id: str) -> TaskResponse:
        for task in lesson.tasks:
            if task.id == task_id:
                return task
        return self._demo_task(task_id, lesson.id)

    def _next_task(self, lesson: LessonResponse, task_id: str) -> TaskResponse | None:
        for index, task in enumerate(lesson.tasks):
            if task.id == task_id and index + 1 < len(lesson.tasks):
                return lesson.tasks[index + 1]
        return None

    async def _explain_mistake(self, answer: str, task: TaskResponse):
        try:
            return await self.ai_service.generate_response(
                user_message=(
                    "Explain this learner mistake briefly and kindly.\n"
                    f"Question: {task.question}\n"
                    f"Learner answer: {answer}\n"
                    f"Correct answer: {task.correct_answer}\n"
                    f"Base explanation: {task.explanation}"
                ),
                persona="JARQ Classic: friendly, clear, supportive tutor.",
                chat_history=[],
                learning_context={"mode": "check_answer", "task_id": task.id},
            )
        except Exception:
            from app.services.ai_service import JARQStructuredResponse

            return JARQStructuredResponse(
                text="Почти. Давай исправим ключевую часть и попробуем еще раз.",
                emotion="calm",
                tone="friendly",
                action="correct_mistake",
                lesson_suggestion=None,
                mini_task=None,
            )

    async def _save_mistake(
        self,
        user_id: str,
        lesson: LessonResponse,
        task: TaskResponse,
        answer: str,
        explanation: str,
    ) -> None:
        if self.client is None:
            return

        try:
            self.client.table("user_mistakes").insert(
                {
                    "user_id": user_id,
                    "subject": lesson.title,
                    "mistake": answer,
                    "correction": task.correct_answer,
                    "explanation": explanation,
                }
            ).execute()
        except Exception:
            return

    async def _update_progress(
        self,
        user_id: str,
        lesson: LessonResponse,
        completed: bool,
        score: int,
    ) -> None:
        if self.client is None:
            return

        try:
            self.client.table("user_progress").upsert(
                {
                    "user_id": user_id,
                    "course_id": lesson.course_id,
                    "lesson_id": lesson.id,
                    "completed": completed,
                    "score": score,
                },
                on_conflict="user_id,course_id,lesson_id",
            ).execute()

            if completed:
                profile = self.client.table("profiles").select("xp").eq("id", user_id).limit(1).execute()
                current_xp = profile.data[0].get("xp", 0) if profile.data else 0
                self.client.table("profiles").update({"xp": current_xp + 10}).eq("id", user_id).execute()
        except Exception:
            return

    def _demo_courses(self) -> list[CourseResponse]:
        return [
            CourseResponse(
                id="english-basics",
                title="Основы английского",
                description="Короткие практические уроки для повседневного английского.",
                subject="Английский",
                level="beginner",
            ),
            CourseResponse(
                id="programming_basics",
                title="Основы программирования",
                description="Переменные, условия, циклы и функции через маленькие code-квесты.",
                subject="Программирование",
                level="beginner",
            ),
            CourseResponse(
                id="speaking-practice",
                title="Разговорная практика",
                description="Подсказки для естественных устных ответов и быстрых исправлений.",
                subject="Английский",
                level="starter",
            ),
            CourseResponse(
                id="grammar-mastery",
                title="Грамматика",
                description="Точные грамматические упражнения с простыми объяснениями.",
                subject="Английский",
                level="beginner",
            ),
        ]

    def _demo_lessons(self) -> list[LessonResponse]:
        return [
            LessonResponse(
                id="ordering-coffee",
                course_id="english-basics",
                title="Заказ кофе",
                content="Практика простого диалога в кафе.",
                order_index=1,
                tasks=[
                    self._demo_task("coffee-1", "ordering-coffee"),
                    TaskResponse(
                        id="coffee-2",
                        lesson_id="ordering-coffee",
                        type="translation",
                        question="Переведи: I would like a small coffee.",
                        correct_answer="I would like a small coffee.",
                        explanation="Для вежливой просьбы используй 'would like'.",
                        difficulty="easy",
                    ),
                ],
            ),
            LessonResponse(
                id="variables_intro",
                course_id="programming_basics",
                title="Переменные",
                content="Сохраняем значения в именах и используем повторно. Пример кода: let lives = 3;",
                order_index=1,
                tasks=[
                    TaskResponse(
                        id="variables_intro_1",
                        lesson_id="variables_intro",
                        type="write_code",
                        question=(
                            "Вопрос: создай переменную score.\n"
                            "Пример кода: let lives = 3;\n"
                            "Практика: напиши JavaScript-код, который сохраняет 10 в score."
                        ),
                        correct_answer="let score = 10;",
                        explanation="Переменная может хранить значение через let: let score = 10;",
                        difficulty="easy",
                    ),
                    TaskResponse(
                        id="variables_intro_2",
                        lesson_id="variables_intro",
                        type="fix_error",
                        question=(
                            "Исправь ошибку:\n"
                            "Пример кода: let name = 'JARQ';\n"
                            "Сломанный код: let score == 10;"
                        ),
                        correct_answer="let score = 10;",
                        explanation="Для присваивания нужен один знак равно.",
                        difficulty="easy",
                    ),
                ],
            ),
            LessonResponse(
                id="conditions_intro",
                course_id="programming_basics",
                title="Условия",
                content="Учим код выбирать между вариантами. Пример кода: if (score > 5) { console.log('win'); }",
                order_index=2,
                tasks=[
                    TaskResponse(
                        id="conditions_intro_1",
                        lesson_id="conditions_intro",
                        type="multiple_choice",
                        question=(
                            "Вопрос: какое ключевое слово начинает условие?\n"
                            "Пример кода: if (score > 5) { console.log('win'); }\n"
                            "Варианты:\nA) if\nB) loop\nC) print"
                        ),
                        correct_answer="A",
                        explanation="Условия в JavaScript обычно начинаются с if.",
                        difficulty="easy",
                    ),
                    TaskResponse(
                        id="conditions_intro_2",
                        lesson_id="conditions_intro",
                        type="write_code",
                        question=(
                            "Практика: напиши условие, которое проверяет, что age равен 18 или больше.\n"
                            "Пример кода: if (score > 10) { console.log('great'); }"
                        ),
                        correct_answer="if (age >= 18) { console.log('adult'); }",
                        explanation="Используй >= для проверки 'больше или равно'.",
                        difficulty="easy",
                    ),
                ],
            ),
            LessonResponse(
                id="loops_intro",
                course_id="programming_basics",
                title="Циклы",
                content="Повторяем действия без копирования кода. Пример кода: for (let i = 0; i < 3; i++) { console.log(i); }",
                order_index=3,
                tasks=[
                    TaskResponse(
                        id="loops_intro_1",
                        lesson_id="loops_intro",
                        type="multiple_choice",
                        question=(
                            "Вопрос: что делает цикл?\n"
                            "Пример кода: for (let i = 0; i < 3; i++) { console.log(i); }\n"
                            "A) Повторяет код\nB) Удаляет код\nC) Останавливает JavaScript"
                        ),
                        correct_answer="A",
                        explanation="Цикл повторяет блок кода.",
                        difficulty="easy",
                    ),
                    TaskResponse(
                        id="loops_intro_2",
                        lesson_id="loops_intro",
                        type="fix_error",
                        question=(
                            "Добавь пропущенное ключевое слово:\n"
                            "Пример кода: for (let i = 0; i < 3; i++) { console.log(i); }\n"
                            "Сломанный код: (let i = 0; i < 3; i++) { console.log(i); }"
                        ),
                        correct_answer="for (let i = 0; i < 3; i++) { console.log(i); }",
                        explanation="Циклу нужно ключевое слово for.",
                        difficulty="easy",
                    ),
                ],
            ),
            LessonResponse(
                id="functions_intro",
                course_id="programming_basics",
                title="Функции",
                content="Упаковываем повторяемые действия в именованные блоки. Пример кода: function sayHi() { return 'Hi'; }",
                order_index=4,
                tasks=[
                    TaskResponse(
                        id="functions_intro_1",
                        lesson_id="functions_intro",
                        type="write_code",
                        question=(
                            "Вопрос: создай функцию greet.\n"
                            "Пример кода: function sayHi() { return 'Hi'; }\n"
                            "Практика: верни 'Hello' из greet."
                        ),
                        correct_answer="function greet() { return 'Hello'; }",
                        explanation="Функции возвращают значения через ключевое слово return.",
                        difficulty="easy",
                    ),
                    TaskResponse(
                        id="functions_intro_2",
                        lesson_id="functions_intro",
                        type="multiple_choice",
                        question=(
                            "Какой вариант вызывает функцию?\n"
                            "Пример кода: greet();\n"
                            "A) greet;\nB) greet();\nC) function greet"
                        ),
                        correct_answer="B",
                        explanation="Скобки вызывают функцию.",
                        difficulty="easy",
                    ),
                ],
            ),
            LessonResponse(
                id="daily-speaking",
                course_id="speaking-practice",
                title="Ежедневная речь",
                content="Отвечай на короткие бытовые вопросы голосом или текстом.",
                order_index=1,
                tasks=[
                    TaskResponse(
                        id="speaking-1",
                        lesson_id="daily-speaking",
                        type="short_answer",
                        question=(
                            "Вопрос: что ты делал вчера?\n"
                            "Пример: Yesterday I practiced English for ten minutes.\n"
                            "Практика: напиши одно естественное предложение."
                        ),
                        correct_answer="Yesterday I practiced English.",
                        explanation="После yesterday используй прошедшее время.",
                        difficulty="easy",
                    )
                ],
            ),
            LessonResponse(
                id="present-simple",
                course_id="grammar-mastery",
                title="Present Simple",
                content="Строим чистые повседневные предложения.",
                order_index=1,
                tasks=[
                    TaskResponse(
                        id="grammar-1",
                        lesson_id="present-simple",
                        type="fix_error",
                        question="Исправь предложение:\nПример: She likes coffee.\nСломанное предложение: She like coffee.",
                        correct_answer="She likes coffee.",
                        explanation="В Present Simple с he, she, it добавляем -s.",
                        difficulty="easy",
                    )
                ],
            ),
        ]

    def _find_demo_lesson(self, lesson_id: str) -> LessonResponse:
        for lesson in self._demo_lessons():
            if lesson.id == lesson_id:
                return lesson
        return LessonResponse(
            id=lesson_id,
            course_id="demo",
            title="Демо-урок",
            content="Запасной демо-урок, пока Supabase не настроен.",
            tasks=[self._demo_task("demo-task", lesson_id)],
        )

    def _demo_task(self, task_id: str, lesson_id: str) -> TaskResponse:
        return TaskResponse(
            id=task_id,
            lesson_id=lesson_id,
            type="short_answer",
            question="Как вежливо попросить кофе на английском?",
            correct_answer="I would like a coffee.",
            explanation="Вежливая просьба в кафе часто начинается с 'I would like...'.",
            difficulty="easy",
        )


def get_lesson_service() -> LessonService:
    return LessonService()
