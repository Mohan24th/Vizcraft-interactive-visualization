import pandas as pd

from app.services.plot_service import load_dataset


def profile_dataset(dataset_id: str):

    # ---------------- LOAD DATASET ----------------
    df = load_dataset(dataset_id)

    profile = {}

    # ---------------- BASIC INFO ----------------
    profile["rows"] = len(df)
    profile["columns_count"] = len(df.columns)
    profile["columns"] = list(df.columns)

    # ---------------- COLUMN TYPES ----------------
    numeric_cols = df.select_dtypes(
        include=["int64", "float64", "int32", "float32"]
    ).columns.tolist()

    categorical_cols = df.select_dtypes(
        exclude=["int64", "float64", "int32", "float32"]
    ).columns.tolist()

    profile["numeric_columns"] = numeric_cols
    profile["categorical_columns"] = categorical_cols

    # ---------------- MISSING VALUES ----------------
    missing_values = df.isnull().sum().to_dict()

    profile["missing_values"] = {
        col: int(count)
        for col, count in missing_values.items()
    }

    # ---------------- DUPLICATES ----------------
    duplicate_rows = int(df.duplicated().sum())

    profile["duplicate_rows"] = duplicate_rows

    # ---------------- NUMERIC SUMMARY ----------------
    numeric_summary = {}

    for col in numeric_cols:

        numeric_summary[col] = {
            "mean": round(float(df[col].mean()), 2),
            "median": round(float(df[col].median()), 2),
            "min": round(float(df[col].min()), 2),
            "max": round(float(df[col].max()), 2),
            "std": round(float(df[col].std()), 2)
        }

    profile["numeric_summary"] = numeric_summary

    # ---------------- CATEGORICAL SUMMARY ----------------
    categorical_summary = {}

    for col in categorical_cols:

        mode_series = df[col].mode()

        categorical_summary[col] = {
            "unique_values": int(df[col].nunique()),
            "top_value": (
                str(mode_series.iloc[0])
                if not mode_series.empty
                else None
            )
        }

    profile["categorical_summary"] = categorical_summary

    # ---------------- DATASET TYPE DETECTION ----------------
    dataset_type = "unknown"

    for col in categorical_cols:

        unique_count = df[col].nunique()

        if unique_count == 2:
            dataset_type = "classification"
            break

    profile["dataset_type"] = dataset_type

    # ---------------- CORRELATIONS ----------------
    correlations = []

    if len(numeric_cols) >= 2:

        corr_matrix = df[numeric_cols].corr()

        for i in range(len(numeric_cols)):
            for j in range(i + 1, len(numeric_cols)):

                corr_value = corr_matrix.iloc[i, j]

                # Only keep meaningful correlations
                if abs(corr_value) >= 0.3:

                    correlations.append({
                        "column_1": numeric_cols[i],
                        "column_2": numeric_cols[j],
                        "correlation": round(float(corr_value), 3)
                    })

        correlations.sort(
            key=lambda x: abs(x["correlation"]),
            reverse=True
        )

    profile["top_correlations"] = correlations[:10]

    if len(correlations) == 0:
        profile["correlation_message"] = (
        "No strong correlations (|r| >= 0.3) found."
    )

    # ---------------- DATA QUALITY SCORE ----------------
    total_missing = int(df.isnull().sum().sum())

    missing_penalty = min(total_missing * 0.1, 30)
    duplicate_penalty = min(duplicate_rows * 0.05, 20)

    quality_score = max(
        0,
        round(100 - missing_penalty - duplicate_penalty)
    )

    profile["data_quality_score"] = quality_score

    return profile