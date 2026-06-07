import json
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_insights(profile: dict):

    prompt = f"""
You are a senior data analyst.

Return ONLY valid JSON.

Format:

{{
  "overview": [],
  "quality": [],
  "patterns": [],
  "recommendations": []
}}

Dataset Profile:

{json.dumps(profile, indent=2)}
"""

    response = model.generate_content(prompt)

    result = response.text
    result = result.replace("```json", "")
    result = result.replace("```", "")
 
    return json.loads(result)