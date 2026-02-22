import pandas as pd

def read_dataset(filepath: str):
    if filepath.endswith(".csv"):
        df = pd.read_csv(filepath)
    else:
        df = pd.read_excel(filepath)
    return df


def detect_schema(df: pd.DataFrame):

    schema = {}

    for col in df.columns:
        dtype = str(df[col].dtype)

        if "int" in dtype or "float" in dtype:
            col_type = "numeric"
        else:
            col_type = "categorical"

        schema[col] = col_type

    return schema
