from typing import Literal

from pydantic import BaseModel


Role = Literal["system", "user", "assistant"]


class AIMessage(BaseModel):
    role: Role
    content: str


class AICompletion(BaseModel):
    content: str
    provider: str
    model: str
