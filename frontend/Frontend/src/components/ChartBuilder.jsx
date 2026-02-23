import { useState } from "react";
import API_BASE from "../api/api";
import "./ChartBuilder.css";

function ChartBuilder({
  dataset,
  setImageUrl,
  xCol,
  yCol,
  chartType,
  setXCol,
  setYCol,
  setChartType
}) {

  if (!dataset) return null;

  //  Loading
  const [loading, setLoading] = useState(false);

  //  Styling Controls
  const [color, setColor] = useState("#2563eb");
  const [linewidth, setLinewidth] = useState(2);
  const [size, setSize] = useState(60);
  const [marker, setMarker] = useState("o");
  const [bins, setBins] = useState(20);
  const [alpha, setAlpha] = useState(1);

  // ---------------- HELPERS ----------------

  const getColumnType = (name) => {
    const col = dataset.columns.find(c => c.name === name);
    return col ? col.type : null;
  };

  const isValidSelection = () => {

    const xType = getColumnType(xCol);
    const yType = getColumnType(yCol);

    if (chartType === "histogram") {
      return xType === "numeric";
    }

    if (chartType === "scatter") {
      return xType === "numeric" && yType === "numeric";
    }

    if (chartType === "bar" || chartType === "boxplot") {
      return xType === "categorical" && yType === "numeric";
    }

    if (chartType === "heatmap" || chartType === "pairplot") {
      const numericCols = dataset.columns.filter(c => c.type === "numeric");
      return numericCols.length >= 2;
    }

    return true;
  };

  // ---------------- GENERATE PLOT ----------------

  const generatePlot = async () => {

    setLoading(true);

    const body = {
      dataset_id: dataset.dataset_id,
      chart_type: chartType,
      x: xCol || null,
      y: yCol || null,
      style: {
        color,
        linewidth,
        size,
        marker,
        bins,
        alpha
      }
    };

    try {
      const res = await fetch(`${API_BASE}/plot/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
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

    setLoading(false);
  };

  // ---------------- UI ----------------

  return (
    <div className="card">
      <h2>Create Visualization</h2>

      {/* Column Selectors */}
      <select value={xCol} onChange={(e) => setXCol(e.target.value)}>
        <option value="">Select X</option>
        {dataset.columns.map((c, i) => (
          <option key={i} value={c.name}>{c.name}</option>
        ))}
      </select>

      <select value={yCol} onChange={(e) => setYCol(e.target.value)}>
        <option value="">Select Y</option>
        {dataset.columns.map((c, i) => (
          <option key={i} value={c.name}>{c.name}</option>
        ))}
      </select>

      <select
        value={chartType}
        onChange={(e) => {
          setChartType(e.target.value);

          if (e.target.value === "histogram") {
            setYCol("");
          }
        }}
      >
        <option value="histogram">Histogram</option>
        <option value="scatter">Scatter</option>
        <option value="bar">Bar</option>
        <option value="boxplot">Boxplot</option>
        <option value="heatmap">Heatmap</option>
        <option value="pairplot">Pairplot</option>
      </select>

      {/* -------- STYLE CONTROLS -------- */}
      <h3 style={{ marginTop: "20px" }}>Style Controls</h3>

      <label>Color:</label>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />

      <br /><br />

      {(chartType === "line" || chartType === "scatter") && (
        <>
          <label>Line Width:</label>
          <input
            type="range"
            min="1"
            max="10"
            value={linewidth}
            onChange={(e) => setLinewidth(Number(e.target.value))}
          />
          <span>{linewidth}</span>

          <br /><br />
        </>
      )}

      {chartType === "scatter" && (
        <>
          <label>Point Size:</label>
          <input
            type="range"
            min="10"
            max="200"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
          <span>{size}</span>

          <br /><br />

          <label>Marker:</label>
          <select value={marker} onChange={(e) => setMarker(e.target.value)}>
            <option value="o">Circle</option>
            <option value="s">Square</option>
            <option value="^">Triangle</option>
            <option value="x">X</option>
          </select>

          <br /><br />
        </>
      )}

      {chartType === "histogram" && (
        <>
          <label>Histogram Bins:</label>
          <input
            type="number"
            min="5"
            max="100"
            value={bins}
            onChange={(e) => setBins(Number(e.target.value))}
          />
          <br /><br />
        </>
      )}

      <label>Transparency:</label>
      <input
        type="range"
        min="0.1"
        max="1"
        step="0.1"
        value={alpha}
        onChange={(e) => setAlpha(Number(e.target.value))}
      />
      <span>{alpha}</span>

      <br /><br />

      {/* -------- GENERATE BUTTON -------- */}
      <button
        onClick={generatePlot}
        disabled={!isValidSelection() || loading}
      >
        {loading ? "Generating..." : "Generate Plot"}
      </button>

      {xCol && !isValidSelection() && (
        <p style={{ color: "red", marginTop: "10px" }}>
          Invalid column selection for this chart type.
        </p>
      )}

    </div>
  );
}

export default ChartBuilder;