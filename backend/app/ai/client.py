from google import genai

from app.core.config import GEMINI_API_KEY


if not GEMINI_API_KEY:
    client = None
else:
    client = genai.Client(
        api_key=GEMINI_API_KEY
    )


MODEL_NAME = "gemini-2.5-flash"


def ask_gemini(prompt: str) -> str:

    if client is None:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured"
        )

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )

    if not response.text:
        raise RuntimeError(
            "Gemini returned an empty response"
        )

    return response.text.strip()
