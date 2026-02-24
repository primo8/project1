import asyncio
import os
import uuid
import edge_tts
import aiofiles

AUDIO_DIR = os.path.join(os.path.dirname(__file__), "..", "audio_cache")
os.makedirs(AUDIO_DIR, exist_ok=True)

VOICES = {
    "en-US-female": "en-US-JennyNeural",
    "en-US-male": "en-US-GuyNeural",
    "en-GB-female": "en-GB-SoniaNeural",
    "en-GB-male": "en-GB-RyanNeural",
    "fr-FR-female": "fr-FR-DeniseNeural",
    "es-ES-female": "es-ES-ElviraNeural",
    "ar-SA-female": "ar-SA-ZariyahNeural",
}


async def synthesize_speech(text: str, voice_key: str = "en-US-female") -> str:
    """Convert text to speech using edge-tts and save to file. Returns filename."""
    voice = VOICES.get(voice_key, VOICES["en-US-female"])
    filename = f"{uuid.uuid4()}.mp3"
    filepath = os.path.join(AUDIO_DIR, filename)

    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(filepath)
    return filename


async def cleanup_old_files():
    """Remove audio files older than 10 minutes to save disk space."""
    import time
    now = time.time()
    try:
        for fname in os.listdir(AUDIO_DIR):
            fpath = os.path.join(AUDIO_DIR, fname)
            if os.path.isfile(fpath) and now - os.path.getmtime(fpath) > 600:
                os.remove(fpath)
    except Exception:
        pass


def get_available_voices() -> list:
    return [{"key": k, "label": k.replace("-", " ").title()} for k in VOICES.keys()]
