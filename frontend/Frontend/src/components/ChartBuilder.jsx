import { useState } from "react";
import API_BASE from "../api/api";
import "./ChartBuilder.css";

function ChartBuilder({ dataset, setImageUrl }) {

  const [xCol, setXCol] = useState("");
  const [yCol, setYCol] = useState("");
  const [chartType, setChartType] = useState("histogram");

  if (!dataset) return null;

  const generatePlot = async () => {

    const body = {
      dataset_id: dataset.dataset_id,
      chart_type: chartType,
      x: xCol || null,
      y: yCol || null
    };

    const res = await fetch(`${API_BASE}/plot/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (data.image_url)
      setImageUrl(API_BASE + data.image_url);
    else
      alert(data.detail);
  };

  return (
    <div className="card">
      <h2>Create Visualization</h2>

      <select onChange={(e) => setXCol(e.target.value)}>
        <option value="">Select X</option>
        {dataset.columns.map((c, i) => (
          <option key={i} value={c.name}>{c.name}</option>
        ))}
      </select>

      <select onChange={(e) => setYCol(e.target.value)}>
        <option value="">Select Y</option>
        {dataset.columns.map((c, i) => (
          <option key={i} value={c.name}>{c.name}</option>
        ))}
      </select>

      <select onChange={(e) => setChartType(e.target.value)}>
        <option value="histogram">Histogram</option>
        <option value="scatter">Scatter</option>
        <option value="bar">Bar</option>
        <option value="boxplot">Boxplot</option>
        <option value="heatmap">Heatmap</option>
        <option value="pairplot">Pairplot</option>
      </select>

      <button onClick={generatePlot}>Generate Plot</button>
    </div>
  );
}

export default ChartBuilder;