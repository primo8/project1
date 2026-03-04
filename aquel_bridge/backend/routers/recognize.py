from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from services.vision_service import extract_landmarks, describe_image_basic
from services.training_service import TrainingService

router = APIRouter(prefix="/api/vision", tags=["Vision"])


@router.post("/recognize")
async def recognize_image(file: UploadFile = File(...)):
    """Analyze uploaded camera image and return a recognized symbol or description."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    contents = await file.read()
    landmarks = extract_landmarks(contents)
    
    if landmarks:
        symbol = TrainingService.recognize_symbol(landmarks)
        if symbol:
            return {"description": symbol, "type": "symbol", "status": "recognized"}
        return {"description": "Hand detected, but symbol not recognized", "type": "hand", "status": "unknown"}
    
    # Fallback to basic description
    description = describe_image_basic(contents)
    return {"description": description, "type": "general", "status": "fallback"}


@router.post("/train")
async def train_symbol(name: str = Form(...), file: UploadFile = File(...)):
    """Train a new symbol with given name using the uploaded image."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    contents = await file.read()
    landmarks = extract_landmarks(contents)
    
    if not landmarks:
        raise HTTPException(status_code=400, detail="No hand detected in the image. Please try again.")
    
    success = TrainingService.save_symbol(name, landmarks)
    if success:
        return {"message": f"Symbol '{name}' trained successfully", "status": "success"}
    else:
        raise HTTPException(status_code=500, detail="Failed to save symbol")


@router.get("/symbols")
async def list_symbols():
    """List all trained symbols."""
    symbols = TrainingService.load_symbols()
    return {"symbols": list(symbols.keys())}


@router.post("/recognize-sequence")
async def recognize_sequence(files: list[UploadFile] = File(...)):
    """Analyze a sequence of images and return a joined sentence."""
    recognized_symbols = []
    last_symbol = None
    
    for file in files:
        if not file.content_type or not file.content_type.startswith("image/"):
            continue
            
        contents = await file.read()
        landmarks = extract_landmarks(contents)
        
        if landmarks:
            symbol = TrainingService.recognize_symbol(landmarks)
            # Only add if it's a new symbol (avoid duplicates in sequence)
            if symbol and symbol != last_symbol:
                recognized_symbols.append(symbol)
                last_symbol = symbol
                
    if not recognized_symbols:
        return {"sentence": "", "message": "No symbols recognized in sequence"}
        
    sentence = " ".join(recognized_symbols)
    return {"sentence": sentence, "symbols": recognized_symbols}
