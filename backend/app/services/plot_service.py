import os
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

from app.services.schema_service import detect_schema
from app.services.validation_service import validate_plot

STORAGE_PATH = "storage"
OUTPUT_PATH = "outputs"

# ensure output folder exists
os.makedirs(OUTPUT_PATH, exist_ok=True)


# ---------------- LOAD DATASET ----------------
def load_dataset(dataset_id: str):

    for file in os.listdir(STORAGE_PATH):
        if file.startswith(dataset_id):
            path = os.path.join(STORAGE_PATH, file)

            if file.endswith(".csv"):
                return pd.read_csv(path)
            else:
                return pd.read_excel(path)

    raise Exception("Dataset not found")


# ---------------- GENERATE PLOT ----------------
def generate_plot(config: dict):

    # 1️ Load dataset
    df = load_dataset(config["dataset_id"])

    # 2️ Detect schema
    schema = detect_schema(df)

    # 3️ Validate request BEFORE plotting
    valid, message = validate_plot(schema, config)
    if not valid:
        raise Exception(message)

    # 4️ Extract parameters
    chart = config["chart_type"]
    x = config.get("x")
    y = config.get("y")
    hue = config.get("hue")

    #  FIX: style safe handling
    style = config.get("style") or {}

    color = style.get("color")
    marker = style.get("marker", "o")
    size = style.get("size", 60)
    linewidth = style.get("linewidth", 2)
    alpha = style.get("alpha", 1)
    bins = style.get("bins", 20)

    # ---------------- PAIRPLOT (special handling) ----------------
    if chart == "pairplot":
        grid = sns.pairplot(df.select_dtypes(include="number"))

        filename = f"{config['dataset_id']}_pairplot.png"
        filepath = os.path.join(OUTPUT_PATH, filename)

        grid.fig.savefig(filepath)
        plt.close('all')
        return filename

    # 5️ Create figure for normal charts
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
        sns.barplot(data=df, x=x, y=y, hue=hue)


    elif chart == "boxplot":
        sns.boxplot(data=df, x=x, y=y)

    elif chart == "violin":
        sns.violinplot(data=df, x=x, y=y)

    elif chart == "count":
        sns.countplot(data=df, x=x)

    elif chart == "heatmap":
        corr = df.corr(numeric_only=True)
        sns.heatmap(corr, annot=True, cmap="coolwarm")

    else:
        raise Exception("Unsupported chart type")

    # ---------------- SAVE IMAGE ----------------
    plt.title(chart)

    filename = f"{config['dataset_id']}_{chart}.png"
    filepath = os.path.join(OUTPUT_PATH, filename)

    plt.savefig(filepath, bbox_inches="tight")
    plt.close()

    return filename