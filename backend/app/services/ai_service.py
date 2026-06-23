import os

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

try:
    model = genai.GenerativeModel(
        "gemini-2.5-flash"
    )

except Exception as e:

    raise Exception(
        f"Gemini initialization failed: {str(e)}"
    )


def ask_gemini(prompt: str):

    try:

        response = model.generate_content(
            prompt
        )

        result = response.text.strip()

        result = result.replace(
            "```json",
            ""
        )

        result = result.replace(
            "```",
            ""
        )

        return result.strip()

    except Exception as e:

        raise Exception(
            f"Gemini request failed: {str(e)}"
        )