def validate_plot(schema: dict, config: dict):

    chart = config["chart_type"]
    x = config.get("x")
    y = config.get("y")

    def is_numeric(col):
        return col and schema.get(col) == "numeric"

    def is_categorical(col):
        return col and schema.get(col) == "categorical"

    # ---- rules ----
    if chart == "scatter":
        if not (is_numeric(x) and is_numeric(y)):
            return False, "Scatter requires two numeric columns"

    elif chart == "histogram":
        if not is_numeric(x):
            return False, "Histogram requires numeric column"

    elif chart == "bar":
        if not (is_categorical(x) and is_numeric(y)):
            return False, "Bar chart requires categorical X and numeric Y"

    elif chart == "boxplot":
        if not (is_categorical(x) and is_numeric(y)):
            return False, "Boxplot requires categorical X and numeric Y"

    elif chart == "count":
        if not is_categorical(x):
            return False, "Countplot requires categorical column"

    elif chart == "heatmap":
        numeric_cols = [c for c,t in schema.items() if t=="numeric"]
        if len(numeric_cols) < 2:
            return False, "Heatmap requires at least 2 numeric columns"

    return True, "valid"
