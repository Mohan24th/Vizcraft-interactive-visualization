import { useState, useEffect } from "react";
import API_BASE from "../api/api";
import "./RecommendationPanel.css";

function RecommendationPanel({ dataset, setImageUrl, setXCol, setYCol, setChartType }) {

  const [selectedCols, setSelectedCols] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Reset when dataset changes
  useEffect(() => {
    setSelectedCols([]);
    setRecommendations([]);
  }, [dataset]);

  if (!dataset) return null;

  const toggleColumn = (colName) => {
    if (selectedCols.includes(colName)) {
      setSelectedCols(selectedCols.filter(c => c !== colName));
    } else {
      setSelectedCols([...selectedCols, colName]);
    }
  };

  const fetchRecommendations = async () => {

    if (selectedCols.length === 0) {
      alert("Select at least one column");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/plot/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataset_id: dataset.dataset_id,
          columns: selectedCols
        })
      });

      const data = await res.json();
      setRecommendations(data.recommendations || []);

    } catch (err) {
      alert("Failed to fetch recommendations");
    }

    setLoading(false);
  };

  const generateFromRecommendation = async (rec) => {

    // 🔥 1. Auto-fill ChartBuilder controls
    setChartType(rec.chart);
    setXCol(rec.x || "");
    setYCol(rec.y || "");

    try {
      const res = await fetch(`${API_BASE}/plot/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataset_id: dataset.dataset_id,
          chart_type: rec.chart,
          x: rec.x || null,
          y: rec.y || null,
          hue: rec.hue || null
        })
      });

      const data = await res.json();

      if (data.image_url) {
        setImageUrl(API_BASE + data.image_url);
      } else {
        alert(data.detail);
      }

    } catch (err) {
      alert("Plot generation failed");
    }
  };

  return (
    <div className="card">
      <h2>Smart Recommendations</h2>

      <p>Select columns to get intelligent chart suggestions:</p>

      <div className="columns">
        {dataset.columns.map((col, i) => (
          <label key={i}>
            <input
              type="checkbox"
              checked={selectedCols.includes(col.name)}
              onChange={() => toggleColumn(col.name)}
            />
            {col.name}
          </label>
        ))}
      </div>

      <button onClick={fetchRecommendations}>
        {loading ? "Analyzing..." : "Get Suggestions"}
      </button>

      {recommendations.length > 0 && (
        <div className="recommendations">
          <h4>Suggested Visualizations:</h4>

          {recommendations.map((rec, i) => (
            <div key={i} className="recommendation-item">
              <span>
                <b>{rec.chart.toUpperCase()}</b>
                {rec.x && ` | X: ${rec.x}`}
                {rec.y && ` | Y: ${rec.y}`}
                {rec.hue && ` | Hue: ${rec.hue}`}
              </span>

              <button onClick={() => generateFromRecommendation(rec)}>
                Generate
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default RecommendationPanel;