import { useState } from "react";
import { motion } from "framer-motion";
import API_BASE from "../api/api";
import GlassCard from "./common/GlassCard";
import { CHART_LABELS } from "../constants/chartTypes.jsx";
import "./ChartBuilder.css";

function ChartBuilder({
  dataset,
  setImageUrl,
  setChartMeta,
  setPlotLoading,
  scrollToVisualization,
  xCol,
  yCol,
  chartType,
  setXCol,
  setYCol,
}) {
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#10b981");
  const [linewidth, setLinewidth] = useState(2);
  const [size, setSize] = useState(60);
  const [marker, setMarker] = useState("o");
  const [bins, setBins] = useState(20);
  const [alpha, setAlpha] = useState(1);
  const [xSearch, setXSearch] = useState("");
  const [ySearch, setYSearch] = useState("");

  if (!dataset) return null;

  const getColumnType = (name) => {
    const col = dataset.columns.find((c) => c.name === name);
    return col ? col.type : null;
  };

  const isValidSelection = () => {
    const xType = getColumnType(xCol);
    const yType = getColumnType(yCol);

    if (chartType === "histogram") return xType === "numeric";
    if (chartType === "scatter" || chartType === "line") {
      return xType === "numeric" && yType === "numeric";
    }
    if (chartType === "bar" || chartType === "boxplot") {
      return xType === "categorical" && yType === "numeric";
    }
    if (chartType === "heatmap" || chartType === "pairplot") {
      return dataset.columns.filter((c) => c.type === "numeric").length >= 2;
    }
    return true;
  };

  const needsY = !["histogram", "heatmap", "pairplot"].includes(chartType);

  const filterColumns = (search) => {
    const q = search.toLowerCase();
    return dataset.columns.filter((c) => c.name.toLowerCase().includes(q));
  };

  const generatePlot = async () => {
    setLoading(true);
    setPlotLoading?.(true);
    scrollToVisualization?.();

    const body = {
      dataset_id: dataset.dataset_id,
      chart_type: chartType,
      x: xCol || null,
      y: yCol || null,
      style: { color, linewidth, size, marker, bins, alpha },
    };

    try {
      const res = await fetch(`${API_BASE}/plot/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.image_url) {
        setImageUrl(API_BASE + data.image_url);
        setChartMeta?.({
          chartType,
          xCol: xCol || null,
          yCol: yCol || null,
          dataPoints: dataset.rows,
          generatedAt: new Date(),
        });
        scrollToVisualization?.();
      } else {
        alert(data.detail);
      }
    } catch {
      alert("Plot generation failed");
    }

    setLoading(false);
    setPlotLoading?.(false);
  };

  return (
    <section className="chart-config">
      <span className="section-label">Step 3</span>
      <h2 className="section-heading">Chart Configuration</h2>

      <GlassCard hover={false}>
        <div className="config-grid">
          <div className="form-group">
            <label htmlFor="x-axis">X Axis</label>
            <input
              type="text"
              className="search-input"
              placeholder="Search columns..."
              value={xSearch}
              onChange={(e) => setXSearch(e.target.value)}
            />
            <select id="x-axis" value={xCol} onChange={(e) => setXCol(e.target.value)}>
              <option value="">Select column</option>
              {filterColumns(xSearch).map((c, i) => (
                <option key={i} value={c.name}>
                  {c.name} ({c.type})
                </option>
              ))}
            </select>
          </div>

          {needsY && (
            <div className="form-group">
              <label htmlFor="y-axis">Y Axis</label>
              <input
                type="text"
                className="search-input"
                placeholder="Search columns..."
                value={ySearch}
                onChange={(e) => setYSearch(e.target.value)}
              />
              <select id="y-axis" value={yCol} onChange={(e) => setYCol(e.target.value)}>
                <option value="">Select column</option>
                {filterColumns(ySearch).map((c, i) => (
                  <option key={i} value={c.name}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Chart Type</label>
            <div className="chart-type-display">
              <span className="chart-type-badge">{CHART_LABELS[chartType] ?? chartType}</span>
            </div>
          </div>
        </div>

        <details className="style-controls">
          <summary>Style Controls</summary>
          <div className="style-controls__body">
            <div className="form-group form-group--inline">
              <label>Color</label>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </div>

            {(chartType === "line" || chartType === "scatter") && (
              <div className="form-group">
                <label>Line Width: {linewidth}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={linewidth}
                  onChange={(e) => setLinewidth(Number(e.target.value))}
                />
              </div>
            )}

            {chartType === "scatter" && (
              <>
                <div className="form-group">
                  <label>Point Size: {size}</label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Marker</label>
                  <select value={marker} onChange={(e) => setMarker(e.target.value)}>
                    <option value="o">Circle</option>
                    <option value="s">Square</option>
                    <option value="^">Triangle</option>
                    <option value="x">X</option>
                  </select>
                </div>
              </>
            )}

            {chartType === "histogram" && (
              <div className="form-group">
                <label>Bins</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={bins}
                  onChange={(e) => setBins(Number(e.target.value))}
                />
              </div>
            )}

            <div className="form-group">
              <label>Transparency: {alpha}</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
              />
            </div>
          </div>
        </details>

        {xCol && !isValidSelection() && (
          <p className="form-error">Invalid column selection for this chart type.</p>
        )}

        <motion.button
          className="btn btn--primary btn--lg"
          onClick={generatePlot}
          disabled={!isValidSelection() || loading}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <span className="btn-loading">
              <span className="btn-spinner" />
              Generating...
            </span>
          ) : (
            "Generate Visualization"
          )}
        </motion.button>
      </GlassCard>
    </section>
  );
}

export default ChartBuilder;
