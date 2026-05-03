from app.services.ai.messages import AICompletion


def parse_ai_text(completion: AICompletion) -> str:
    """Normalize provider output before it is returned to clients."""

    return completion.content.strip()
