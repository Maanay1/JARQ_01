from fastapi import APIRouter, Depends

from app.models.persona_models import PersonaResponse
from app.services.persona_service import PersonaService, get_persona_service

router = APIRouter(prefix="/personas", tags=["personas"])


@router.get("", response_model=list[PersonaResponse])
async def list_personas(
    persona_service: PersonaService = Depends(get_persona_service),
) -> list[PersonaResponse]:
    return persona_service.list_personas()


@router.get("/{persona_id}", response_model=PersonaResponse)
async def get_persona(
    persona_id: str,
    persona_service: PersonaService = Depends(get_persona_service),
) -> PersonaResponse:
    return persona_service.get_persona(persona_id)
