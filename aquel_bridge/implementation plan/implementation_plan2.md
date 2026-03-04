# Implementation Plan - Aquel Bridge Enhancements

Upgrade Aquel Bridge to support real-time symbol recognition, custom symbol training, and sentence translation.

## Proposed Changes

### Backend

#### [MODIFY] [requirements.txt](file:///c:/Users/_d_av1d_/project1/aquel_bridge/backend/requirements.txt)
- Add `mediapipe`, `opencv-python-headless`, `numpy`.

#### [MODIFY] [vision_service.py](file:///c:/Users/_d_av1d_/project1/aquel_bridge/backend/services/vision_service.py)
- Integrate MediaPipe Hands for landmark extraction.
- Implement symbol matching using landmark distances.

#### [NEW] [training_service.py](file:///c:/Users/_d_av1d_/project1/aquel_bridge/backend/services/training_service.py)
- Service to save and load user-defined symbols (stored in `symbols.json`).

#### [MODIFY] [recognize.py](file:///c:/Users/_d_av1d_/project1/aquel_bridge/backend/routers/recognize.py)
- Add endpoints for `/train` and `/recognize-sequence`.

### Frontend

#### [MODIFY] [App.jsx](file:///c:/Users/_d_av1d_/project1/aquel_bridge/frontend/src/App.jsx)
- Redesign with a premium dark/vibrant theme.
- Add components for "Training Mode" and "Sentence Recording".

#### [NEW] [Theme.css](file:///c:/Users/_d_av1d_/project1/aquel_bridge/frontend/src/Theme.css)
- Implement a glassmorphism-based design system.

## Verification Plan

### Automated Tests
- Test API endpoints for symbol training and recognition using `httpx`.
- Verify hand landmark extraction with sample images.

### Manual Verification
- Use the webcam via the frontend to train a new symbol and then recognize it.
- Record a sequence of symbols and verify the translation.
- Validate TTS (Text-to-Speech) works with the recognized text.
