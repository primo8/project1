import base64
import io
from PIL import Image


def describe_image_basic(image_bytes: bytes) -> str:
    """
    Basic image analysis using PIL.
    Returns a simple description based on image properties.
    For production, integrate Google Vision API or OpenAI Vision here.
    """
    try:
        img = Image.open(io.BytesIO(image_bytes))
        width, height = img.size
        mode = img.mode

        # Get dominant colors
        img_small = img.convert("RGB").resize((50, 50))
        pixels = list(img_small.getdata())
        avg_r = sum(p[0] for p in pixels) // len(pixels)
        avg_g = sum(p[1] for p in pixels) // len(pixels)
        avg_b = sum(p[2] for p in pixels) // len(pixels)

        brightness = (avg_r + avg_g + avg_b) / 3

        color_desc = "colorful"
        if avg_r > avg_g and avg_r > avg_b:
            color_desc = "reddish"
        elif avg_g > avg_r and avg_g > avg_b:
            color_desc = "greenish"
        elif avg_b > avg_r and avg_b > avg_g:
            color_desc = "bluish"
        elif brightness > 200:
            color_desc = "bright white"
        elif brightness < 50:
            color_desc = "dark"

        aspect = width / height
        shape_desc = "square" if abs(aspect - 1) < 0.2 else ("wide" if aspect > 1 else "tall")

        return f"I see a {shape_desc} {color_desc} picture from the camera"
    except Exception as e:
        return "I see something from the camera"
