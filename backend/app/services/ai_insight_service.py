import json

from app.services.ai_service import (
    ask_gemini
)


def generate_insights(profile: dict):

    lightweight_profile = {
        "rows": profile.get("rows"),
        "columns_count": profile.get(
            "columns_count"
        ),
        "numeric_columns": profile.get(
            "numeric_columns"
        ),
        "categorical_columns": profile.get(
            "categorical_columns"
        ),
        "data_quality_score": profile.get(
            "data_quality_score"
        ),
        "top_correlations": profile.get(
            "top_correlations",
            []
        )[:5]
    }

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

Rules:

Maximum 3 points per section.

Maximum 15 words per point.

Dataset Profile:

{json.dumps(lightweight_profile, indent=2)}
"""

    try:

        result = ask_gemini(
            prompt
        )

        return json.loads(
            result
        )

    except Exception:

        return {

            "overview": [
                f"{profile['rows']} rows available",
                f"{profile['columns_count']} columns detected"
            ],

            "quality": [
                f"Quality score: {profile['data_quality_score']}"
            ],

            "patterns": [
                "Review correlations for relationships"
            ],

            "recommendations": [
                "Generate charts for exploration"
            ]
        }