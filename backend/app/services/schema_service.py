import pandas as pd


def read_dataset(filepath):
    filepath = str(filepath)

    if filepath.lower().endswith(".csv"):
        return pd.read_csv(filepath)

    if filepath.lower().endswith((".xlsx", ".xls")):
        return pd.read_excel(filepath)

    raise ValueError("Unsupported dataset format")


def detect_schema(df: pd.DataFrame):
    schema = {}

    for column in df.columns:
        series = df[column]

        if pd.api.types.is_numeric_dtype(series):
            column_type = "numeric"

        elif pd.api.types.is_datetime64_any_dtype(series):
            column_type = "datetime"

        else:
            numeric_series = pd.to_numeric(series, errors="coerce")

            non_null_count = series.notna().sum()

            if non_null_count > 0:
                numeric_count = numeric_series.notna().sum()
                numeric_ratio = numeric_count / non_null_count
            else:
                numeric_count = 0
                numeric_ratio = 0

            # Treat mixed columns as numeric when the majority
            # of their values are numeric.
            if numeric_ratio >= 0.50 and numeric_count >= 10:
                column_type = "numeric"
            else:
                column_type = "categorical"

        schema[column] = column_type

    return schema