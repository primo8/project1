import base64
import io
import cv2
import numpy as np
import mediapipe as mp
from PIL import Image

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=1,
    min_detection_confidence=0.5
)

def extract_landmarks(image_bytes: bytes):
    """
    Extracts 21 hand landmarks using MediaPipe.
    Returns: List of [x, y, z] coordinates or None if no hand detected.
    """
    try:
        # Convert bytes to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return None
            
        # Convert to RGB for MediaPipe
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = hands.process(img_rgb)
        
        if not results.multi_hand_landmarks:
            return None
            
        # Get landmarks for the first hand detected
        hand_landmarks = results.multi_hand_landmarks[0]
        landmarks = [[lm.x, lm.y, lm.z] for lm in hand_landmarks.landmark]
        return landmarks
    except Exception as e:
        print(f"Error extracting landmarks: {e}")
        return None

def describe_image_basic(image_bytes: bytes) -> str:
    """
    Placeholder for simple description if no symbol/hand is detected.
    """
    try:
        img = Image.open(io.BytesIO(image_bytes))
        width, height = img.size
        return f"I see a {width}x{height} image from the camera"
    except Exception:
        return "I see something from the camera"
