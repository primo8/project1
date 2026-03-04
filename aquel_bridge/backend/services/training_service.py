import json
import os
import numpy as np

SYMBOLS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "symbols.json")

class TrainingService:
    @staticmethod
    def load_symbols():
        if not os.path.exists(SYMBOLS_FILE):
            os.makedirs(os.path.dirname(SYMBOLS_FILE), exist_ok=True)
            with open(SYMBOLS_FILE, "w") as f:
                json.dump({}, f)
            return {}
        
        try:
            with open(SYMBOLS_FILE, "r") as f:
                return json.load(f)
        except Exception:
            return {}

    @staticmethod
    def save_symbol(name, landmarks):
        """
        landmarks: List of [x, y, z] coordinates from MediaPipe
        """
        symbols = TrainingService.load_symbols()
        # Normalize landmarks relative to the wrist (landmark 0)
        landmarks = np.array(landmarks)
        wrist = landmarks[0]
        normalized = (landmarks - wrist).tolist()
        
        symbols[name] = normalized
        
        with open(SYMBOLS_FILE, "w") as f:
            json.dump(symbols, f)
        return True

    @staticmethod
    def recognize_symbol(current_landmarks):
        """
        Matches current landmarks against stored symbols using Euclidean distance.
        """
        symbols = TrainingService.load_symbols()
        if not symbols:
            return None
            
        current_landmarks = np.array(current_landmarks)
        wrist = current_landmarks[0]
        current_normalized = current_landmarks - wrist
        
        best_match = None
        min_dist = float('inf')
        
        for name, stored_landmarks in symbols.items():
            stored_landmarks = np.array(stored_landmarks)
            # Simple Euclidean distance sum
            dist = np.linalg.norm(current_normalized - stored_landmarks)
            
            if dist < min_dist:
                min_dist = dist
                best_match = name
                
        # Threshold for recognition (tune this)
        if min_dist < 0.2: # Example threshold
            return best_match
        return None

    @staticmethod
    def delete_symbol(name):
        symbols = TrainingService.load_symbols()
        if name in symbols:
            del symbols[name]
            with open(SYMBOLS_FILE, "w") as f:
                json.dump(symbols, f)
            return True
        return False
