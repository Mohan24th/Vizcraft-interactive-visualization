import os

import pandas as pd
import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import seaborn as sns

from app.services.schema_service import detect_schema
from app.services.validation_service import validate_plot
from app.services.dataset_service import load_dataset
from app.core.storage import OUTPUTS_DIR


# ---------------- GENERATE PLOT ----------------
def generate_plot(config: dict):
    # 1. Load dataset
    df = load_dataset(config["dataset_id"])

    # 2. Detect schema
    schema = detect_schema(df)

    # 3. Validate request BEFORE plotting
    valid, message = validate_plot(schema, config)

    if not valid:
        raise Exception(message)

    # 4. Normalize columns detected as numeric
    #
    # Handles mixed columns such as:
    # 976077
    # 854561
    # "C"
    #
    # Non-numeric values become NaN.
    for column, column_type in schema.items():
        if column_type == "numeric":
            df[column] = pd.to_numeric(
                df[column],
                errors="coerce"
            )

    # 5. Extract parameters
    chart = config["chart_type"]
    x = config.get("x")
    y = config.get("y")
    hue = config.get("hue")

    # 6. Safe style handling
    style = config.get("style") or {}

    color = style.get("color")
    marker = style.get("marker", "o")
    size = style.get("size", 60)
    linewidth = style.get("linewidth", 2)
    alpha = style.get("alpha", 1)
    bins = style.get("bins", 20)

    # ---------------- PAIRPLOT ----------------
    if chart == "pairplot":
        numeric_df = df.select_dtypes(include="number")

        if numeric_df.empty:
            raise ValueError(
                "Pairplot requires at least one numeric column"
            )

        grid = sns.pairplot(numeric_df)

        filename = (
            f"{config['dataset_id']}_pairplot.png"
        )

        filepath = OUTPUTS_DIR / filename

        grid.fig.savefig(
            str(filepath),
            bbox_inches="tight"
        )

        plt.close("all")

        return filename

    # ---------------- CREATE FIGURE ----------------
    plt.figure(figsize=(7, 5))

    # ---------------- CHART SELECTOR ----------------

    if chart == "scatter":

        sns.scatterplot(
            data=df,
            x=x,
            y=y,
            hue=hue,
            s=size,
            color=color,
            marker=marker,
            alpha=alpha
        )

    elif chart == "line":

        sns.lineplot(
            data=df,
            x=x,
            y=y,
            hue=hue,
            linewidth=linewidth,
            color=color
        )

    elif chart == "histogram":

        sns.histplot(
            data=df,
            x=x,
            bins=bins,
            color=color,
            alpha=alpha
        )

    elif chart == "bar":

        sns.barplot(
            data=df,
            x=x,
            y=y,
            hue=hue
        )

    elif chart == "boxplot":

        sns.boxplot(
            data=df,
            x=x,
            y=y
        )

    elif chart == "violin":

        sns.violinplot(
            data=df,
            x=x,
            y=y
        )

    elif chart == "count":

        sns.countplot(
            data=df,
            x=x
        )

    elif chart == "heatmap":

        corr = df.corr(
            numeric_only=True
        )

        sns.heatmap(
            corr,
            annot=True,
            cmap="coolwarm"
        )

    else:

        raise Exception(
            "Unsupported chart type"
        )

    # ---------------- SAVE IMAGE ----------------

    plt.title(chart)

    filename = (
        f"{config['dataset_id']}_{chart}.png"
    )

    filepath = OUTPUTS_DIR / filename

    plt.savefig(
        str(filepath),
        bbox_inches="tight"
    )

    plt.close()

    return filename