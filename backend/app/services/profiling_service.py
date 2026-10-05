import pandas as pd

from app.services.dataset_service import load_dataset
from app.services.schema_service import detect_schema


def profile_dataset(dataset_id: str):

    # --------------------------------------------------
    # 1. LOAD DATASET
    # --------------------------------------------------

    df = load_dataset(dataset_id)

    # --------------------------------------------------
    # 2. USE THE SAME SCHEMA DETECTION AS PLOTTING
    # --------------------------------------------------

    schema = detect_schema(df)

    numeric_columns = [
        column
        for column, column_type in schema.items()
        if column_type == "numeric"
    ]

    categorical_columns = [
        column
        for column, column_type in schema.items()
        if column_type == "categorical"
    ]

    datetime_columns = [
        column
        for column, column_type in schema.items()
        if column_type == "datetime"
    ]

    # --------------------------------------------------
    # 3. NORMALIZE NUMERIC COLUMNS
    # --------------------------------------------------

    for column in numeric_columns:

        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )

    # --------------------------------------------------
    # 4. MISSING VALUES
    # --------------------------------------------------

    missing_values = {
        column: int(count)
        for column, count in df.isnull().sum().items()
    }

    total_missing = int(
        df.isnull().sum().sum()
    )

    # --------------------------------------------------
    # 5. DUPLICATES
    # --------------------------------------------------

    duplicate_rows = int(
        df.duplicated().sum()
    )

    # --------------------------------------------------
    # 6. NUMERIC SUMMARY
    # --------------------------------------------------

    numeric_summary = {}

    for column in numeric_columns:

        series = df[column].dropna()

        if series.empty:

            numeric_summary[column] = {
                "mean": None,
                "median": None,
                "min": None,
                "max": None,
                "std": None,
            }

            continue

        numeric_summary[column] = {
            "mean": round(
                float(series.mean()),
                2
            ),

            "median": round(
                float(series.median()),
                2
            ),

            "min": round(
                float(series.min()),
                2
            ),

            "max": round(
                float(series.max()),
                2
            ),

            "std": round(
                float(series.std()),
                2
            ),
        }

    # --------------------------------------------------
    # 7. CATEGORICAL SUMMARY
    # --------------------------------------------------

    categorical_summary = {}

    for column in categorical_columns:

        series = df[column]

        mode = series.mode()

        categorical_summary[column] = {
            "unique_values": int(
                series.nunique()
            ),

            "top_value": (
                str(mode.iloc[0])
                if not mode.empty
                else None
            ),
        }

    # --------------------------------------------------
    # 8. CORRELATIONS
    # --------------------------------------------------

    correlations = []

    if len(numeric_columns) >= 2:

        correlation_matrix = df[
            numeric_columns
        ].corr()

        for i in range(len(numeric_columns)):

            for j in range(i + 1, len(numeric_columns)):

                value = correlation_matrix.iloc[i, j]

                if pd.notna(value) and abs(value) >= 0.3:

                    correlations.append({
                        "column_1": numeric_columns[i],
                        "column_2": numeric_columns[j],
                        "correlation": round(
                            float(value),
                            3
                        ),
                    })

        correlations.sort(
            key=lambda item: abs(
                item["correlation"]
            ),
            reverse=True,
        )

    # --------------------------------------------------
    # 9. DATA QUALITY SCORE
    # --------------------------------------------------

    missing_penalty = min(
        total_missing * 0.1,
        30,
    )

    duplicate_penalty = min(
        duplicate_rows * 0.05,
        20,
    )

    quality_score = max(
        0,
        round(
            100
            - missing_penalty
            - duplicate_penalty
        ),
    )

    # --------------------------------------------------
    # 10. DATASET TYPE
    # --------------------------------------------------

    dataset_type = "unknown"

    for column in categorical_columns:

        if df[column].nunique() <= 10:

            dataset_type = "classification"
            break

    # --------------------------------------------------
    # 11. RETURN PROFILE
    # --------------------------------------------------

    return {

        "rows": int(
            len(df)
        ),

        "columns_count": int(
            len(df.columns)
        ),

        "columns": list(
            df.columns
        ),

        "numeric_columns": numeric_columns,

        "categorical_columns": categorical_columns,

        "datetime_columns": datetime_columns,

        "missing_values": missing_values,

        "total_missing_values": total_missing,

        "duplicate_rows": duplicate_rows,

        "memory_usage_mb": round(
            df.memory_usage(deep=True).sum()
            / (1024 * 1024),
            2,
        ),

        "numeric_summary": numeric_summary,

        "categorical_summary": categorical_summary,

        "dataset_type": dataset_type,

        "top_correlations": correlations[:10],

        "data_quality_score": quality_score,
    }