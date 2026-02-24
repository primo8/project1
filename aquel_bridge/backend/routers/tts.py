from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import asyncio
from services.tts_service import synthesize_speech, get_available_voices, cleanup_old_files

router = APIRouter(prefix="/api/tts", tags=["TTS"])

AUDIO_DIR = os.path.join(os.path.dirname(__file__), "..", "audio_cache")


class SpeakRequest(BaseModel):
    text: str
    voice: str = "en-US-female"


@router.post("/speak")
async def speak(request: SpeakRequest):
    """Convert text to speech and return audio filename."""
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    if len(request.text) > 500:
        raise HTTPException(status_code=400, detail="Text too long (max 500 chars)")
    
    try:
        # Cleanup old files in background
        asyncio.create_task(cleanup_old_files())
        filename = await synthesize_speech(request.text.strip(), request.voice)
        return {"filename": filename, "url": f"/api/tts/audio/{filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS failed: {str(e)}")


@router.get("/audio/{filename}")
async def get_audio(filename: str):
    """Serve generated audio file."""
    # Security: only allow valid UUID filenames
    if not filename.endswith(".mp3") or len(filename) > 50:
        raise HTTPException(status_code=400, detail="Invalid filename")
    
    filepath = os.path.join(AUDIO_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    return FileResponse(filepath, media_type="audio/mpeg")


@router.get("/voices")
async def list_voices():
    """List available TTS voices."""
    return {"voices": get_available_voices()}
