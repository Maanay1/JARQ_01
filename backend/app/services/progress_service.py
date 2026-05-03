from collections import Counter
from uuid import uuid4

from app.db.supabase import get_supabase_client
from app.models.progress_models import MistakeEvent, UserProgressResponse


class ProgressService:
    """Tracks learner progress and mistake history."""

    def __init__(self) -> None:
        self.client = get_supabase_client()

    async def get_user_progress(self, user_id: str) -> UserProgressResponse:
        if self.client is None:
            mistakes = self._demo_mistakes(user_id)
            return self._build_response(user_id, 2, 140, 4, 3, mistakes)

        try:
            profile_response = self.client.table("profiles").select("level, xp, streak").eq("id", user_id).limit(1).execute()
            progress_response = (
                self.client.table("user_progress")
                .select("completed")
                .eq("user_id", user_id)
                .eq("completed", True)
                .execute()
            )
            mistakes = await self.list_mistakes(user_id)
            profile = profile_response.data[0] if profile_response.data else {}
            return self._build_response(
                user_id=user_id,
                level=int(profile.get("level", 1)),
                xp=int(profile.get("xp", 0)),
                streak=int(profile.get("streak", 0)),
                completed_lessons=len(progress_response.data or []),
                mistakes=mistakes,
            )
        except Exception:
            mistakes = self._demo_mistakes(user_id)
            return self._build_response(user_id, 1, 0, 0, 0, mistakes)

    async def list_mistakes(self, user_id: str) -> list[MistakeEvent]:
        if self.client is None:
            return self._demo_mistakes(user_id)

        try:
            response = (
                self.client.table("user_mistakes")
                .select("id, user_id, subject, mistake, correction, explanation, created_at")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .limit(10)
                .execute()
            )
            return [MistakeEvent.model_validate(row) for row in response.data or []]
        except Exception:
            return self._demo_mistakes(user_id)

    async def add_xp(self, user_id: str, amount: int) -> UserProgressResponse:
        if self.client is None:
            return self._build_response(user_id, 2, amount, 1, 0, self._demo_mistakes(user_id))

        try:
            profile = self.client.table("profiles").select("xp, level, streak").eq("id", user_id).limit(1).execute()
            current = profile.data[0] if profile.data else {"xp": 0, "level": 1, "streak": 0}
            new_xp = int(current.get("xp", 0)) + amount
            new_level = max(int(current.get("level", 1)), new_xp // 100 + 1)
            payload = {"id": user_id, "xp": new_xp, "level": new_level, "streak": int(current.get("streak", 0))}
            self.client.table("profiles").upsert(payload).execute()
            return await self.get_user_progress(user_id)
        except Exception:
            return await self.get_user_progress(user_id)

    async def update_streak(self, user_id: str, increment: int) -> UserProgressResponse:
        if self.client is None:
            return self._build_response(user_id, 1, 0, increment, 0, self._demo_mistakes(user_id))

        try:
            profile = self.client.table("profiles").select("xp, level, streak").eq("id", user_id).limit(1).execute()
            current = profile.data[0] if profile.data else {"xp": 0, "level": 1, "streak": 0}
            payload = {
                "id": user_id,
                "xp": int(current.get("xp", 0)),
                "level": int(current.get("level", 1)),
                "streak": int(current.get("streak", 0)) + increment,
            }
            self.client.table("profiles").upsert(payload).execute()
            return await self.get_user_progress(user_id)
        except Exception:
            return await self.get_user_progress(user_id)

    def _build_response(
        self,
        user_id: str,
        level: int,
        xp: int,
        streak: int,
        completed_lessons: int,
        mistakes: list[MistakeEvent],
    ) -> UserProgressResponse:
        weak_topics = self._weak_topics(mistakes)
        return UserProgressResponse(
            user_id=user_id,
            level=level,
            xp=xp,
            streak=streak,
            completed_lessons=completed_lessons,
            known_mistakes=len(mistakes),
            weak_topics=weak_topics,
            latest_mistakes=mistakes[:5],
            jarq_recommendation=self._recommendation(weak_topics),
        )

    def _weak_topics(self, mistakes: list[MistakeEvent]) -> list[str]:
        subjects = [mistake.subject for mistake in mistakes if mistake.subject]
        return [subject for subject, _count in Counter(subjects).most_common(3)]

    def _recommendation(self, weak_topics: list[str]) -> str:
        if weak_topics:
            return f"Я заметил, что ты часто ошибаешься в {weak_topics[0]}. Давай повторим это."
        return "Я пока не вижу устойчивых слабых тем. Давай пройдем еще пару заданий и найдем точку роста."

    def _demo_mistakes(self, user_id: str) -> list[MistakeEvent]:
        return [
            MistakeEvent(
                id=str(uuid4()),
                user_id=user_id,
                subject="Past Simple",
                mistake="I go yesterday",
                correction="I went yesterday",
                explanation="For past events, use the past form: went.",
                created_at=None,
            ),
            MistakeEvent(
                id=str(uuid4()),
                user_id=user_id,
                subject="Past Simple",
                mistake="She buyed coffee",
                correction="She bought coffee",
                explanation="'Buy' is irregular, so the past form is 'bought'.",
                created_at=None,
            ),
        ]


def get_progress_service() -> ProgressService:
    return ProgressService()
