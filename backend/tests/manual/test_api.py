import requests
import sys
from pathlib import Path

BASE_URL = "http://127.0.0.1:8000"
CSV_FILE = Path(__file__).parent / "test_data.csv"

session = requests.Session()


def check(name, response):
    print(f"\n{'=' * 60}")
    print(name)
    print(f"Status: {response.status_code}")

    try:
        data = response.json()
        print(data)
    except Exception:
        print(response.text[:1000])
        data = None

    if response.ok:
        print("✅ PASS")
    else:
        print("❌ FAIL")

    return data


# ---------------------------------------------------------
# 1. Upload
# ---------------------------------------------------------

print("VIZCRAFT API TEST")
print(f"CSV: {CSV_FILE}")

if not CSV_FILE.exists():
    print(f"❌ CSV not found: {CSV_FILE}")
    sys.exit(1)

with open(CSV_FILE, "rb") as f:
    response = session.post(
        f"{BASE_URL}/data/upload",
        files={"file": ("test_data.csv", f, "text/csv")},
    )

upload = check("1. DATASET UPLOAD", response)

if not response.ok:
    print("\nStopping because upload failed.")
    sys.exit(1)

dataset_id = upload["dataset_id"]
columns = [column["name"] for column in upload["columns"]]

print(f"\nDataset ID: {dataset_id}")
print(f"Columns: {columns}")


# ---------------------------------------------------------
# 2. Analysis
# ---------------------------------------------------------

response = session.get(
    f"{BASE_URL}/analysis/{dataset_id}"
)

analysis = check("2. DATASET ANALYSIS", response)


# ---------------------------------------------------------
# 3. Normal chart recommendations
# ---------------------------------------------------------

response = session.post(
    f"{BASE_URL}/plot/recommend",
    json={
        "dataset_id": dataset_id,
        "columns": columns,
    },
)

recommendations = check(
    "3. NORMAL CHART RECOMMENDATIONS",
    response,
)


# ---------------------------------------------------------
# 4. Visualization
# ---------------------------------------------------------

# Pick a numeric column automatically.
numeric_candidates = [
    "Value",
    "value",
    "**Value",
]

numeric_column = next(
    (c for c in numeric_candidates if c in columns),
    None,
)

if numeric_column is None:
    print("\n⚠️ Could not find a Value column.")
    print("Available columns:", columns)
else:
    response = session.post(
        f"{BASE_URL}/plot/generate",
        json={
            "dataset_id": dataset_id,
            "chart_type": "bar",
            "x": "Industry_name_NZSIOC",
            "y": numeric_column,
        },
    )

    plot = check("4. VISUALIZATION", response)


# ---------------------------------------------------------
# 5. Basic insights/profile
# ---------------------------------------------------------

response = session.post(
    f"{BASE_URL}/insights/profile",
    json={
        "dataset_id": dataset_id,
    },
)

profile = check("5. PROFILE / INSIGHTS", response)


# ---------------------------------------------------------
# 6. AI insights
# ---------------------------------------------------------

response = session.post(
    f"{BASE_URL}/ai/generate",
    json={
        "dataset_id": dataset_id,
    },
)

ai = check("6. AI INSIGHTS", response)


# ---------------------------------------------------------
# 7. AI chart recommendations
# ---------------------------------------------------------

response = session.post(
    f"{BASE_URL}/chart-recommendations/recommend",
    json={
        "dataset_id": dataset_id,
    },
)

ai_charts = check(
    "7. AI CHART RECOMMENDATIONS",
    response,
)


# ---------------------------------------------------------
# 8. Natural-language visualization
# ---------------------------------------------------------

response = session.post(
    f"{BASE_URL}/nl-visualization/",
    json={
        "dataset_id": dataset_id,
        "query": "Show total income by industry",
    },
)

nl = check(
    "8. NATURAL LANGUAGE VISUALIZATION",
    response,
)


print("\n")
print("=" * 60)
print("TEST COMPLETE")
print("=" * 60)
print(f"Dataset ID: {dataset_id}")
