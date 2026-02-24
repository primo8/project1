from fastapi import APIRouter, File, UploadFile, HTTPException
from services.vision_service import describe_image_basic

router = APIRouter(prefix="/api/vision", tags=["Vision"])


@router.post("/recognize")
async def recognize_image(file: UploadFile = File(...)):
    """Analyze uploaded camera image and return a text description."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="Image too large")
    
    description = describe_image_basic(contents)
    return {"description": description}
