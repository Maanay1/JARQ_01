from pydantic import BaseModel


class PersonaResponse(BaseModel):
    id: str
    name: str
    description: str
    system_prompt: str
    voice_style: str
    avatar_emotion_style: str
