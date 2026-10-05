from google import genai

from app.core.config import GEMINI_API_KEY


MODEL_NAME = "gemini-2.5-flash"


client = None

if GEMINI_API_KEY:
    client = genai.Client(
        api_key=GEMINI_API_KEY
    )


def ask_gemini(prompt: str) -> str:

    if client is None:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured"
        )

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config={
            "response_mime_type": "application/json",
        },
    )

    if not response.text:
        raise RuntimeError(
            "Gemini returned an empty response"
        )

    return response.text.strip()
