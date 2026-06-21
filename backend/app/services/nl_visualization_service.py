import json

from app.services.dataset_service import (
    load_dataset
)

from app.services.ai_service import (
    ask_gemini
)


def query_to_chart(
    dataset_id: str,
    query: str
):

    try:

        df = load_dataset(dataset_id)

        columns = list(df.columns)

        prompt = f"""
You are a data visualization assistant.

Dataset Columns:

{columns}

User Query:

{query}

Convert the query into chart JSON.

Allowed chart types:

- histogram
- scatter
- bar
- boxplot
- heatmap
- pairplot

Rules:

1. Return ONLY JSON.

2. Use existing columns only.

3. No markdown.

4. No explanations.

Example:

{{
    "chart_type":"scatter",
    "x":"age",
    "y":"income"
}}
"""

        result = ask_gemini(prompt)

        return json.loads(result)

    except json.JSONDecodeError:

        raise Exception(
            "Gemini returned invalid JSON"
        )

    except Exception as e:

        raise Exception(
            f"Natural language visualization failed: {str(e)}"
        )