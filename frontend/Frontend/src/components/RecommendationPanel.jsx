import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API_BASE from "../api/api";
import GlassCard from "./common/GlassCard";
import "./RecommendationPanel.css";

function RecommendationPanel({
  dataset,
  setImageUrl,
  setChartMeta,
  setPlotLoading,
  scrollToVisualization,
  setXCol,
  setYCol,
  setChartType,
}) {
  const [selectedCols, setSelectedCols] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedCols([]);
    setRecommendations([]);
  }, [dataset]);

  if (!dataset) return null;

  const toggleColumn = (colName) => {
    setSelectedCols((prev) =>
      prev.includes(colName)
        ? prev.filter((c) => c !== colName)
        : [...prev, colName]
    );
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
          columns: selectedCols,
        }),
      });

      const data = await res.json();
      setRecommendations(data.recommendations || []);
    } catch {
      alert("Failed to fetch recommendations");
    }

    setLoading(false);
  };

  const generateFromRecommendation = async (rec) => {
    setChartType(rec.chart);
    setXCol(rec.x || "");
    setYCol(rec.y || "");
    setPlotLoading?.(true);
    scrollToVisualization?.();

    try {
      const res = await fetch(`${API_BASE}/plot/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataset_id: dataset.dataset_id,
          chart_type: rec.chart,
          x: rec.x || null,
          y: rec.y || null,
          hue: rec.hue || null,
        }),
      });

      const data = await res.json();

      if (data.image_url) {
        setImageUrl(API_BASE + data.image_url);
        setChartMeta?.({
          chartType: rec.chart,
          xCol: rec.x || null,
          yCol: rec.y || null,
          dataPoints: dataset.rows,
          generatedAt: new Date(),
        });
        scrollToVisualization?.();
      } else {
        alert(data.detail);
      }
    } catch {
      alert("Plot generation failed");
    } finally {
      setPlotLoading?.(false);
    }
  };

  return (
    <section className="recommendations-section">
      <span className="section-label">AI Assist</span>
      <h2 className="section-heading">Smart Recommendations</h2>

      <GlassCard hover={false}>
        <p className="glass-card__subtitle">
          Select columns to get intelligent chart suggestions powered by your data schema.
        </p>

        <div className="columns">
          {dataset.columns.map((col, i) => (
            <label
              key={i}
              className={`column-chip ${selectedCols.includes(col.name) ? "column-chip--active" : ""}`}
            >
              <input
                type="checkbox"
                checked={selectedCols.includes(col.name)}
                onChange={() => toggleColumn(col.name)}
              />
              {col.name}
            </label>
          ))}
        </div>

        <motion.button
          className="btn btn--primary"
          onClick={fetchRecommendations}
          disabled={loading}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <span className="btn-loading">
              <span className="btn-spinner" />
              Analyzing...
            </span>
          ) : (
            "Get Suggestions"
          )}
        </motion.button>

        {recommendations.length > 0 && (
          <div className="recommendations">
            <h4 className="recommendations__title">Suggested Visualizations</h4>
            {recommendations.map((rec, i) => (
              <motion.div
                key={i}
                className="recommendation-item"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="recommendation-item__info">
                  <span className="recommendation-item__type">{rec.chart}</span>
                  <span className="recommendation-item__axes">
                    {rec.x && `X: ${rec.x}`}
                    {rec.y && ` · Y: ${rec.y}`}
                    {rec.hue && ` · Hue: ${rec.hue}`}
                  </span>
                </div>
                <button
                  className="btn btn--secondary btn--sm"
                  onClick={() => generateFromRecommendation(rec)}
                >
                  Generate
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </section>
  );
}

export default RecommendationPanel;
