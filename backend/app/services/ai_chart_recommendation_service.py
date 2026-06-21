import json

from app.services.ai_service import (
    ask_gemini
)


def generate_chart_recommendations(profile: dict):

    lightweight_profile = {
        "rows": profile.get("rows"),
        "columns": profile.get("columns"),
        "numeric_columns": profile.get(
            "numeric_columns"
        ),
        "categorical_columns": profile.get(
            "categorical_columns"
        ),
        "top_correlations": profile.get(
            "top_correlations",
            []
        )[:5],
        "dataset_type": profile.get(
            "dataset_type"
        )
    }

    prompt = f"""
You are a senior data analyst and visualization expert.

Return ONLY valid JSON.

Format:

{{
  "charts": [
    {{
      "chart": "histogram",
      "x": "column_name",
      "y": null,
      "reason": "Short reason"
    }}
  ]
}}

Allowed chart types ONLY:

- histogram
- scatter
- bar
- boxplot
- heatmap
- pairplot

Rules:

1. Recommend 3 to 5 charts.

2. Use ONLY columns provided.

3. Reasons maximum 10 words.

4. No markdown.

5. No explanations.

Dataset Profile:

{json.dumps(lightweight_profile, indent=2)}
"""

    result = ask_gemini(prompt)

    try:

        return json.loads(result)

    except Exception:

        return {
            "charts": [
                {
                    "chart": "histogram",
                    "x": (
                        profile["numeric_columns"][0]
                        if profile["numeric_columns"]
                        else None
                    ),
                    "y": None,
                    "reason": "Fallback recommendation"
                }
            ]
        }