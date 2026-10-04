from app.services.dataset_service import load_dataset
from app.services.schema_service import detect_schema


def recommend_charts(dataset_id: str, selected_columns: list):

    df = load_dataset(dataset_id)
    schema = detect_schema(df)

    numeric = [
        column
        for column in selected_columns
        if schema.get(column) == "numeric"
    ]

    categorical = [
        column
        for column in selected_columns
        if schema.get(column) == "categorical"
    ]

    recommendations = []

    if len(numeric) == 1 and not categorical:

        recommendations.extend([
            {
                "chart": "histogram",
                "x": numeric[0],
            },
            {
                "chart": "boxplot",
                "y": numeric[0],
            },
        ])

    elif len(categorical) == 1 and not numeric:

        recommendations.append({
            "chart": "count",
            "x": categorical[0],
        })

    elif len(numeric) == 2 and not categorical:

        recommendations.append({
            "chart": "scatter",
            "x": numeric[0],
            "y": numeric[1],
        })

    elif len(numeric) == 1 and len(categorical) == 1:

        recommendations.extend([
            {
                "chart": "boxplot",
                "x": categorical[0],
                "y": numeric[0],
            },
            {
                "chart": "violin",
                "x": categorical[0],
                "y": numeric[0],
            },
        ])

    elif len(categorical) == 2 and not numeric:

        recommendations.append({
            "chart": "count",
            "x": categorical[0],
            "hue": categorical[1],
        })

    elif len(numeric) >= 3 and not categorical:

        recommendations.extend([
            {
                "chart": "pairplot",
            },
            {
                "chart": "heatmap",
            },
        ])

    elif len(numeric) >= 2 and categorical:

        recommendations.append({
            "chart": "scatter",
            "x": numeric[0],
            "y": numeric[1],
            "hue": categorical[0],
        })

    return recommendations 
