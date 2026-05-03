from __future__ import annotations

from typing import Any

from app.db.supabase import get_supabase_client


async def get_learning_context(
    user_id: str,
    course_id: str | None = None,
    lesson_id: str | None = None,
) -> dict[str, Any]:
    """Build the compact learner memory block used in AI prompts.

    The function is defensive by design: when Supabase is not configured or tables
    are still evolving, it returns useful defaults instead of blocking chat.
    """

    service = LearningContextService()
    return await service.get_learning_context(user_id, course_id=course_id, lesson_id=lesson_id)


class LearningContextService:
    def __init__(self) -> None:
        self.client = get_supabase_client()

    async def get_learning_context(
        self,
        user_id: str,
        course_id: str | None = None,
        lesson_id: str | None = None,
    ) -> dict[str, Any]:
        context = self._default_context(user_id, course_id)
        context["lesson_id"] = lesson_id

        if self.client is None:
            return context

        try:
            profile = await self._get_profile(user_id)
            mistakes = await self._get_recent_mistakes(user_id)
            current_course = await self._get_current_course(course_id or profile.get("current_course"))
            recent_history = await self.get_recent_chat_history(user_id)

            context.update(
                {
                    "level": profile.get("level", context["level"]),
                    "xp": profile.get("xp", context["xp"]),
                    "streak": profile.get("streak", context["streak"]),
                    "recent_mistakes": mistakes,
                    "current_course": current_course,
                    "preferred_persona": profile.get("preferred_persona") or context["preferred_persona"],
                    "studying_topics": profile.get("studying_topics") or context["studying_topics"],
                    "recent_chat_history": recent_history,
                }
            )
        except Exception:
            return context

        return context

    async def get_recent_chat_history(self, user_id: str, limit: int = 6) -> list[dict[str, str]]:
        if self.client is None:
            return []

        try:
            response = (
                self.client.table("chat_history")
                .select("user_message, ai_response")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .limit(limit)
                .execute()
            )
        except Exception:
            return []

        messages: list[dict[str, str]] = []
        for row in reversed(response.data or []):
            user_message = row.get("user_message")
            ai_response = row.get("ai_response")
            if user_message:
                messages.append({"role": "user", "content": user_message})
            if ai_response:
                messages.append({"role": "assistant", "content": ai_response})
        return messages

    async def save_chat_turn(
        self,
        user_id: str,
        user_message: str,
        ai_response: str,
        persona_id: str,
        emotion: str | None = None,
    ) -> None:
        if self.client is None:
            return

        try:
            self.client.table("chat_history").insert(
                {
                    "user_id": user_id,
                    "persona_id": persona_id,
                    "user_message": user_message,
                    "ai_response": ai_response,
                    "emotion": emotion,
                }
            ).execute()
        except Exception:
            return

    async def remember_preferences(
        self,
        user_id: str,
        preferred_persona: str | None = None,
        current_course: str | None = None,
    ) -> None:
        if self.client is None:
            return

        payload: dict[str, Any] = {"id": user_id}
        if preferred_persona:
            payload["preferred_persona"] = preferred_persona
        if current_course:
            payload["current_course"] = current_course

        try:
            self.client.table("profiles").upsert(payload).execute()
        except Exception:
            return

    async def _get_profile(self, user_id: str) -> dict[str, Any]:
        response = (
            self.client.table("profiles")
            .select("level, xp, streak, preferred_persona, current_course, studying_topics")
            .eq("id", user_id)
            .limit(1)
            .execute()
        )
        return response.data[0] if response.data else {}

    async def _get_recent_mistakes(self, user_id: str, limit: int = 5) -> list[dict[str, str | None]]:
        response = (
            self.client.table("user_mistakes")
            .select("subject, mistake, correction, explanation")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return list(response.data or [])

    async def _get_current_course(self, course_id: str | None) -> str | None:
        if course_id is None:
            return None

        response = self.client.table("courses").select("id, title").eq("id", course_id).limit(1).execute()
        if response.data:
            return response.data[0].get("title") or response.data[0].get("id")
        return course_id

    def _default_context(self, user_id: str, course_id: str | None) -> dict[str, Any]:
        return {
            "user_id": user_id,
            "level": "beginner",
            "xp": 0,
            "streak": 0,
            "recent_mistakes": [],
            "current_course": course_id,
            "preferred_persona": "jarq_classic",
            "studying_topics": [],
            "recent_chat_history": [],
        }
