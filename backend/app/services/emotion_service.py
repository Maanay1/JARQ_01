from pydantic import BaseModel


class EmotionState(BaseModel):
    label: str = "neutral"
    confidence: float = 0.5
    teaching_hint: str = "Keep the reply clear and encouraging."


class EmotionService:
    """Lightweight placeholder for detecting learner emotion from interaction signals."""

    async def detect(self, text: str) -> EmotionState:
        lowered = text.lower()
        if any(word in lowered for word in ["confused", "не понял", "сложно"]):
            return EmotionState(
                label="confused",
                confidence=0.7,
                teaching_hint="Slow down and explain with a concrete example.",
            )
        return EmotionState()


def get_emotion_service() -> EmotionService:
    return EmotionService()
