import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API_BASE from "../../api/api";
import GlassCard from "../common/GlassCard";
import "./AIInsights.css";

function AIInsights({ dataset }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!dataset?.dataset_id) {
      setInsights(null);
      return;
    }

    const fetchInsights = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/ai/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dataset_id: dataset.dataset_id,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Failed to generate AI insights");
        }

        setInsights(data.insights);
      } catch (err) {
        console.error("AI insights error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [dataset?.dataset_id]);

  if (!dataset) return null;

  return (
    <section className="ai-insights-section">
      <div className="ai-insights-header">
        <div>
          <h3 className="section-heading">
            AI Data Insights
          </h3>

          <p className="ai-insights-subtitle">
            Automatically generated observations from your dataset.
          </p>
        </div>

        {loading && (
          <div className="ai-insights-loading">
            <span className="ai-spinner" />
            Analyzing dataset...
          </div>
        )}
      </div>

      {error && (
        <GlassCard hover={false}>
          <div className="ai-insights-error">
            <strong>Unable to generate insights</strong>
            <span>{error}</span>
          </div>
        </GlassCard>
      )}

      {!loading && !error && insights && (
        <div className="ai-insights-grid">
          <InsightCard
            title="Overview"
            icon="◉"
            items={insights.overview}
          />

          <InsightCard
            title="Data Quality"
            icon="✓"
            items={insights.quality}
          />

          <InsightCard
            title="Patterns"
            icon="⌁"
            items={insights.patterns}
          />

          <InsightCard
            title="Recommendations"
            icon="→"
            items={insights.recommendations}
          />
        </div>
      )}
    </section>
  );
}

function InsightCard({ title, icon, items = [] }) {
  return (
    <motion.div
      className="ai-insight-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="ai-insight-card__header">
        <span className="ai-insight-card__icon">
          {icon}
        </span>

        <h3>{title}</h3>
      </div>

      {items.length > 0 ? (
        <ul className="ai-insight-card__list">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="ai-insight-empty">
          No insights available.
        </p>
      )}
    </motion.div>
  );
}

export default AIInsights;