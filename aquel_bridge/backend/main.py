import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routers import tts, recognize, symbols

app = FastAPI(
    title="Aquel Bridge API",
    description="Backend for the Aquel Bridge AAC communication app",
    version="1.0.0",
)

# Allow React dev server and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(tts.router)
app.include_router(recognize.router)
app.include_router(symbols.router)


@app.get("/")
async def root():
    return {
        "app": "Aquel Bridge",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
