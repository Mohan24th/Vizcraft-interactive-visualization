import { useState } from "react";
import { motion } from "framer-motion";
import API_BASE from "../../api/api";
import GlassCard from "../common/GlassCard";
import "./NLVisualization.css";

function NLVisualization({
  dataset,
  setImageUrl,
  setChartMeta,
  setPlotLoading,
  scrollToVisualization,
  setXCol,
  setYCol,
  setChartType,
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!dataset) return null;

  const generateVisualization = async () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError("Describe the visualization you want.");
      return;
    }

    setLoading(true);
    setError("");
    setPlotLoading?.(true);
    scrollToVisualization?.();

    try {
      /*
       * STEP 1
       * Natural language -> chart configuration
       *
       * IMPORTANT:
       * Backend route is /nl-visualization/
       */
      const configResponse = await fetch(
        `${API_BASE}/nl-visualization/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dataset_id: dataset.dataset_id,
            query: trimmedQuery,
          }),
        }
      );

      const configData = await configResponse.json();

      if (!configResponse.ok) {
        throw new Error(
          configData.detail ||
            "AI could not understand the visualization request."
        );
      }

      const chartConfig = configData.chart_config;

      if (!chartConfig) {
        throw new Error(
          "AI did not return a chart configuration."
        );
      }

      console.log("AI chart configuration:", chartConfig);

      /*
       * Normalize AI response.
       */
      const chartType =
        chartConfig.chart_type ||
        chartConfig.chart ||
        chartConfig.type;

      const x =
        chartConfig.x ||
        chartConfig.x_column ||
        null;

      const y =
        chartConfig.y ||
        chartConfig.y_column ||
        null;

      const hue =
        chartConfig.hue ||
        chartConfig.color ||
        null;

      if (!chartType) {
        throw new Error(
          "AI did not specify a chart type."
        );
      }

      /*
       * STEP 2
       * Update the manual builder so the UI
       * reflects what AI selected.
       */
      setChartType?.(chartType);
      setXCol?.(x || "");
      setYCol?.(y || "");

      /*
       * STEP 3
       * Use the EXISTING plot engine.
       */
      const plotResponse = await fetch(
        `${API_BASE}/plot/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dataset_id: dataset.dataset_id,
            chart_type: chartType,
            x,
            y,
            hue,
          }),
        }
      );

      const plotData = await plotResponse.json();

      if (!plotResponse.ok) {
        throw new Error(
          plotData.detail ||
            "The chart configuration was created, but the plot could not be generated."
        );
      }

      if (!plotData.image_url) {
        throw new Error(
          "The backend generated no plot image."
        );
      }

      /*
       * STEP 4
       * Display generated image.
       */
      setImageUrl?.(
        `${API_BASE}${plotData.image_url}`
      );

      /*
       * STEP 5
       * Store metadata.
       */
      setChartMeta?.({
        chartType,
        xCol: x,
        yCol: y,
        hue,
        query: trimmedQuery,
        dataPoints: dataset.rows,
        generatedAt: new Date(),
      });

      scrollToVisualization?.();

    } catch (err) {
      console.error(
        "Natural language visualization error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while generating the visualization."
      );

    } finally {
      setLoading(false);
      setPlotLoading?.(false);
    }
  };

  const exampleQueries = [
    "Show the value by year as a line chart",
    "Compare value across industries",
    "Create a histogram of value",
    "Show a scatter plot of year and value",
  ];

  return (
    <section className="nl-visualization-section">
      <span className="section-label">
        AI Assist
      </span>

      <h2 className="section-heading">
        Ask VizCraft
      </h2>

      <GlassCard hover={false}>
        <p className="glass-card__subtitle">
          Describe the visualization you want in plain
          English. VizCraft will choose the chart and
          columns for you.
        </p>

        <div className="nl-input-wrapper">
          <textarea
            className="nl-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setError("");
            }}
            placeholder="Example: Show the value by year as a line chart"
            rows={4}
            disabled={loading}
          />
        </div>

        <div className="nl-examples">
          <span className="nl-examples__label">
            Try:
          </span>

          {exampleQueries.map(
            (example, index) => (
              <button
                key={index}
                type="button"
                className="nl-example"
                onClick={() => {
                  setQuery(example);
                  setError("");
                }}
                disabled={loading}
              >
                {example}
              </button>
            )
          )}
        </div>

        {error && (
          <div className="nl-error">
            {error}
          </div>
        )}

        <motion.button
          type="button"
          className="btn btn--primary nl-generate-btn"
          onClick={generateVisualization}
          disabled={loading}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <span className="btn-loading">
              <span className="btn-spinner" />
              Creating visualization...
            </span>
          ) : (
            "Generate Visualization"
          )}
        </motion.button>
      </GlassCard>
    </section>
  );
}

export default NLVisualization;