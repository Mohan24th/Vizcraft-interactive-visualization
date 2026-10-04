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
        if pd.api.types.is_numeric_dtype(df[column]):
            column_type = "numeric"
        elif pd.api.types.is_datetime64_any_dtype(df[column]):
            column_type = "datetime"
        else:
            column_type = "categorical"

        schema[column] = column_type

    return schema