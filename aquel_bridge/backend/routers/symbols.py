from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import os
from typing import Optional

router = APIRouter(prefix="/api/symbols", tags=["Symbols"])

SYMBOLS_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "symbols.json")


def load_symbols():
    with open(SYMBOLS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


@router.get("/")
async def get_symbols(category: Optional[str] = None):
    """Return all symbols, optionally filtered by category."""
    symbols = load_symbols()
    if category:
        symbols = [s for s in symbols if s["category"].lower() == category.lower()]
    return {"symbols": symbols}


@router.get("/categories")
async def get_categories():
    """Return all unique symbol categories."""
    symbols = load_symbols()
    categories = sorted(list(set(s["category"] for s in symbols)))
    return {"categories": categories}
