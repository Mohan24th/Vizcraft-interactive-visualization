def validate_plot(schema: dict, config: dict):

    chart = config.get("chart_type")
    x = config.get("x")
    y = config.get("y")

    def exists(column):
        return column is not None and column in schema

    def numeric(column):
        return exists(column) and schema[column] == "numeric"

    def categorical(column):
        return exists(column) and schema[column] == "categorical"

    if not chart:
        return False, "Chart type is required"

    if chart == "scatter":
        if not (numeric(x) and numeric(y)):
            return False, "Scatter requires two numeric columns"

    elif chart == "line":
        if not (exists(x) and numeric(y)):
            return False, "Line chart requires X and numeric Y"

    elif chart == "histogram":
        if not numeric(x):
            return False, "Histogram requires a numeric column"

    elif chart == "bar":
        if not (categorical(x) and numeric(y)):
            return False, "Bar chart requires categorical X and numeric Y"

    elif chart == "boxplot":
        if not (categorical(x) and numeric(y)):
            return False, "Boxplot requires categorical X and numeric Y"

    elif chart == "violin":
        if not (categorical(x) and numeric(y)):
            return False, "Violin plot requires categorical X and numeric Y"

    elif chart == "count":
        if not categorical(x):
            return False, "Count plot requires a categorical column"

    elif chart == "heatmap":
        numeric_columns = [
            column
            for column, column_type in schema.items()
            if column_type == "numeric"
        ]

        if len(numeric_columns) < 2:
            return False, "Heatmap requires at least 2 numeric columns"

    elif chart == "pairplot":
        numeric_columns = [
            column
            for column, column_type in schema.items()
            if column_type == "numeric"
        ]

        if len(numeric_columns) < 2:
            return False, "Pairplot requires at least 2 numeric columns"

    else:
        return False, f"Unsupported chart type: {chart}"

    return True, "valid"
