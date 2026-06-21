def build_ai_context(profile: dict):

    return {
        "rows": profile.get("rows"),
        "columns_count": profile.get("columns_count"),
        "columns": profile.get("columns"),
        "numeric_columns": profile.get("numeric_columns"),
        "categorical_columns": profile.get("categorical_columns"),
        "datetime_columns": profile.get("datetime_columns"),
        "dataset_type": profile.get("dataset_type"),
        "data_quality_score": profile.get("data_quality_score"),
        "top_correlations": profile.get(
            "top_correlations",
            []
        )[:5]
    }