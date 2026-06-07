import json
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_chart_recommendations(profile: dict):

    prompt = f"""
You are a senior data analyst and visualization expert.

Analyze the dataset profile and recommend the BEST visualizations.

Return ONLY valid JSON.

Format:

{{
  "charts": [
    {{
      "chart": "histogram",
      "x": "column_name",
      "y": null,
      "reason": "Why this chart is useful"
    }}
  ]
}}

IMPORTANT RULES:
0 Chart-specific rules:

0.1. histogram
   - Use x only
   - y must be null

0.2. scatter
   - Use x and y
   - Both must be numeric

0.3. bar
   - Use x only
   - y must be null

0.4. boxplot
   - x categorical
   - y numeric

0.5. heatmap
   - x must be null
   - y must be null

0.6. pairplot
   - x must be null
   - y must be null

1. Allowed chart types ONLY:

- histogram
- scatter
- bar
- boxplot
- heatmap
- pairplot

Never use any other chart type.

2. Recommend between 3 and 5 charts.

3. Recommendations must be diverse.

At least:

- 1 distribution chart
- 1 comparison chart
- 1 relationship chart

Do NOT recommend the same chart type repeatedly.

4. Use ONLY columns present in the dataset profile.

5. Prefer charts that help answer business questions.

6. If dataset_type is classification:

Prioritize:

- class distribution
- feature vs target comparisons
- important predictors

7. If strong correlations exist:

Recommend scatter plots.

8. If no strong correlations exist:

Avoid unnecessary scatter plots.

9. For categorical vs numeric:

Prefer boxplots.

10. For many numeric columns:

Recommend heatmap or pairplot.

11. Reasons should be concise.

Maximum 2 sentences.

12. Return JSON ONLY.

No markdown.
No explanations.
No code fences.

Dataset Profile:

{json.dumps(profile, indent=2)}
"""

    response = model.generate_content(prompt)

    result = response.text.strip()

    # Remove markdown fences if Gemini adds them
    result = result.replace("```json", "")
    result = result.replace("```", "")
    result = result.strip()

    try:
        return json.loads(result)

    except Exception:

        return {
            "charts": [
                {
                    "chart": "histogram",
                    "x": profile["numeric_columns"][0]
                    if profile["numeric_columns"]
                    else None,
                    "y": None,
                    "reason": "Fallback recommendation"
                }
            ]
        }