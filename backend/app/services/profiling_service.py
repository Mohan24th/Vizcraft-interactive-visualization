import pandas as pd

from app.services.dataset_service import load_dataset


def profile_dataset(dataset_id: str):

    df = load_dataset(dataset_id)

    numeric_columns = df.select_dtypes(
        include="number"
    ).columns.tolist()

    categorical_columns = df.select_dtypes(
        exclude="number"
    ).columns.tolist()

    datetime_columns = []

    for column in df.columns:
        try:
            parsed = pd.to_datetime(
                df[column],
                errors="coerce"
            )

            if len(df) > 0:
                success_rate = parsed.notna().mean()

                if success_rate >= 0.8:
                    datetime_columns.append(column)

        except Exception:
            continue

    missing_values = {
        column: int(count)
        for column, count in df.isnull().sum().items()
    }

    duplicate_rows = int(df.duplicated().sum())

    numeric_summary = {}

    for column in numeric_columns:

        series = df[column]

        numeric_summary[column] = {
            "mean": round(float(series.mean()), 2)
            if not series.empty else None,

            "median": round(float(series.median()), 2)
            if not series.empty else None,

            "min": round(float(series.min()), 2)
            if not series.empty else None,

            "max": round(float(series.max()), 2)
            if not series.empty else None,

            "std": round(float(series.std()), 2)
            if not series.empty else None,
        }

    categorical_summary = {}

    for column in categorical_columns:

        mode = df[column].mode()

        categorical_summary[column] = {
            "unique_values": int(
                df[column].nunique()
            ),
            "top_value": (
                str(mode.iloc[0])
                if not mode.empty
                else None
            ),
        }

    correlations = []

    if len(numeric_columns) >= 2:

        correlation_matrix = df[numeric_columns].corr()

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

    total_missing = int(
        df.isnull().sum().sum()
    )

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

    dataset_type = "unknown"

    for column in categorical_columns:

        if df[column].nunique() <= 10:
            dataset_type = "classification"
            break

    return {
        "rows": int(len(df)),
        "columns_count": int(len(df.columns)),
        "columns": list(df.columns),

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
