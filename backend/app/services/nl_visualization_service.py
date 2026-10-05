import json
import re

from app.ai.client import ask_gemini
from app.services.profiling_service import profile_dataset


ALLOWED_CHART_TYPES = {
    "bar",
    "line",
    "scatter",
    "histogram",
    "boxplot",
    "heatmap",
    "pairplot",
}


def _extract_json(text: str) -> dict:
    """
    Safely extract JSON from Gemini's response.
    Handles accidental markdown fences or surrounding text.
    """

    if not text:
        raise ValueError("Gemini returned an empty response")

    text = text.strip()

    # Remove markdown fences
    text = re.sub(
        r"^```json\s*",
        "",
        text,
        flags=re.IGNORECASE,
    )

    text = re.sub(
        r"^```\s*",
        "",
        text,
    )

    text = re.sub(
        r"\s*```$",
        "",
        text,
    )

    text = text.strip()

    # Direct JSON
    try:
        result = json.loads(text)

        if not isinstance(result, dict):
            raise ValueError(
                "Gemini response must be a JSON object"
            )

        return result

    except json.JSONDecodeError:
        pass

    # Try extracting JSON object
    start = text.find("{")
    end = text.rfind("}")

    if start == -1 or end == -1:
        raise ValueError(
            "Gemini did not return a JSON object"
        )

    candidate = text[start:end + 1]

    try:
        result = json.loads(candidate)

    except json.JSONDecodeError as e:
        raise ValueError(
            f"Gemini returned invalid JSON: {e}"
        )

    if not isinstance(result, dict):
        raise ValueError(
            "Gemini response must be a JSON object"
        )

    return result


def _build_context(profile: dict) -> dict:
    """
    Build a small context for Gemini.

    IMPORTANT:
    The actual dataset is NOT sent to Gemini.
    """

    columns = profile.get("columns", [])

    # Handle profiles where columns may be dictionaries
    normalized_columns = []

    for column in columns:

        if isinstance(column, dict):
            normalized_columns.append(
                {
                    "name": column.get("name"),
                    "type": column.get("type"),
                }
            )

        else:
            normalized_columns.append(
                {
                    "name": column,
                    "type": None,
                }
            )

    return {
        "rows": profile.get("rows"),
        "columns_count": profile.get("columns_count"),
        "columns": normalized_columns,
        "numeric_columns": profile.get(
            "numeric_columns",
            [],
        ),
        "categorical_columns": profile.get(
            "categorical_columns",
            [],
        ),
        "datetime_columns": profile.get(
            "datetime_columns",
            [],
        ),
        "dataset_type": profile.get(
            "dataset_type",
        ),
        "data_quality_score": profile.get(
            "data_quality_score",
        ),
        "top_correlations": profile.get(
            "top_correlations",
            [],
        ),
    }


def query_to_chart(
    dataset_id: str,
    query: str,
):
    """
    Convert a natural-language request into
    a validated chart configuration.

    Gemini only receives dataset metadata/profile,
    never the complete dataset.
    """

    if not query or not query.strip():
        raise ValueError(
            "Visualization request cannot be empty"
        )

    print("NL: loading dataset profile...")

    profile = profile_dataset(dataset_id)

    context = _build_context(profile)

    print("NL: building Gemini context...")

    prompt = f"""
You are VizCraft's natural-language data visualization assistant.

Your job is to convert the user's request into a
valid visualization configuration.

IMPORTANT:

You are NOT generating the chart image.

You are ONLY deciding:

- chart type
- X column
- Y column
- optional hue column
- short explanation

The backend will generate the actual chart.

DATASET CONTEXT:

{json.dumps(context, indent=2, default=str)}

USER REQUEST:

{query}

AVAILABLE CHART TYPES:

- bar
- line
- scatter
- histogram
- boxplot
- heatmap
- pairplot

RULES:

1. ONLY use columns that exist in the dataset context.

2. NEVER invent column names.

3. For histogram:
   - use x
   - y should be null.

4. For scatter:
   - x should normally be numeric
   - y should normally be numeric.

5. For line:
   - prefer datetime or numeric x
   - y should normally be numeric.

6. For bar:
   - prefer categorical x
   - use numeric y when appropriate.

7. For boxplot:
   - categorical x is preferred
   - numeric y is preferred.

8. For heatmap:
   - x and y can be null.

9. For pairplot:
   - x and y can be null.

10. If the user explicitly mentions a column,
    use that exact column when valid.

11. If the request is ambiguous,
    choose the most sensible valid visualization
    using the available columns.

12. Do not explain anything outside the JSON.

RETURN ONLY THIS JSON STRUCTURE:

{{
    "chart_type": "line",
    "x": "Year",
    "y": "Value",
    "hue": null,
    "reason": "Shows how Value changes over Year."
}}
"""

    print("NL: asking Gemini...")

    raw_response = ask_gemini(prompt)

    print("NL: Gemini response received")

    config = _extract_json(raw_response)

    chart_type = config.get("chart_type")
    x = config.get("x")
    y = config.get("y")
    hue = config.get("hue")
    reason = config.get("reason")

    # ---------------- VALIDATE CHART ----------------

    if chart_type not in ALLOWED_CHART_TYPES:

        raise ValueError(
            f"Invalid chart type returned by Gemini: "
            f"{chart_type}"
        )

    # ---------------- VALIDATE COLUMNS ----------------

    available_columns = set(
        context.get("numeric_columns", [])
        + context.get("categorical_columns", [])
        + context.get("datetime_columns", [])
    )

    # Fallback to explicit column names
    if not available_columns:

        available_columns = {
            column["name"]
            for column in context["columns"]
            if column.get("name")
        }

    if x is not None and x not in available_columns:

        raise ValueError(
            f"Gemini selected invalid X column: {x}"
        )

    if y is not None and y not in available_columns:

        raise ValueError(
            f"Gemini selected invalid Y column: {y}"
        )

    if hue is not None and hue not in available_columns:

        raise ValueError(
            f"Gemini selected invalid hue column: {hue}"
        )

    # ---------------- CHART-SPECIFIC VALIDATION ----------------

    if chart_type == "histogram":

        if not x:
            raise ValueError(
                "Histogram requires an X column"
            )

        y = None

    if chart_type == "scatter":

        if not x or not y:
            raise ValueError(
                "Scatter plot requires X and Y columns"
            )

    if chart_type == "line":

        if not x or not y:
            raise ValueError(
                "Line chart requires X and Y columns"
            )

    if chart_type == "bar":

        if not x:
            raise ValueError(
                "Bar chart requires an X column"
            )

    if chart_type == "boxplot":

        if not x or not y:
            raise ValueError(
                "Box plot requires X and Y columns"
            )

    result = {
        "chart_type": chart_type,
        "x": x,
        "y": y,
        "hue": hue,
        "reason": reason,
    }

    print(
        "NL: chart configuration:",
        result,
    )

    return result
