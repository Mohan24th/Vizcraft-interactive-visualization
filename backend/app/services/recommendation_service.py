from app.services.schema_service import detect_schema
from app.services.plot_service import load_dataset


def recommend_charts(dataset_id: str, selected_columns: list):

    df = load_dataset(dataset_id)
    schema = detect_schema(df)

    numeric = [c for c in selected_columns if schema.get(c) == "numeric"]
    categorical = [c for c in selected_columns if schema.get(c) == "categorical"]

    recommendations = []

    # ---------------- 1 NUMERIC ----------------
    if len(numeric) == 1 and len(categorical) == 0:
        col = numeric[0]

        recommendations.append({
            "chart": "histogram",
            "x": col
        })

        recommendations.append({
            "chart": "boxplot",
            "y": col
        })

    # ---------------- 1 CATEGORICAL ----------------
    elif len(categorical) == 1 and len(numeric) == 0:
        recommendations.append({
            "chart": "count",
            "x": categorical[0]
        })

    # ---------------- 2 NUMERIC ----------------
    elif len(numeric) == 2 and len(categorical) == 0:
        recommendations.append({
            "chart": "scatter",
            "x": numeric[0],
            "y": numeric[1]
        })

    # ---------------- NUMERIC + CATEGORICAL ----------------
    elif len(numeric) == 1 and len(categorical) == 1:
        recommendations.append({
            "chart": "boxplot",
            "x": categorical[0],
            "y": numeric[0]
        })

        recommendations.append({
            "chart": "violin",
            "x": categorical[0],
            "y": numeric[0]
        })

    # ---------------- 2 CATEGORICAL ----------------
    elif len(categorical) == 2 and len(numeric) == 0:
        recommendations.append({
            "chart": "bar",
            "x": categorical[0],
            "hue": categorical[1]
        })

    # ---------------- ≥3 NUMERIC ----------------
    elif len(numeric) >= 3 and len(categorical) == 0:
        recommendations.append({"chart": "pairplot"})
        recommendations.append({"chart": "heatmap"})

    # ---------------- NUMERIC + NUMERIC + CATEGORICAL ----------------
    elif len(numeric) >= 2 and len(categorical) >= 1:
        recommendations.append({
            "chart": "scatter",
            "x": numeric[0],
            "y": numeric[1],
            "hue": categorical[0]
        })

    return recommendations