import { useState } from "react";
import UploadDataset from "../components/UploadDataset";
import DatasetInfo from "../components/DatasetInfo";
import ChartBuilder from "../components/ChartBuilder";
import PlotViewer from "../components/PlotViewer";
import RecommendationPanel from "../components/RecommendationPanel";
import "./Dashboard.css";

function Dashboard() {

  const [dataset, setDataset] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [xCol, setXCol] = useState("");
  const [yCol, setYCol] = useState("");
  const [chartType, setChartType] = useState("histogram");

  return (
    <div className="dashboard">

      <div className="left-panel">
        <h1>VizCraft</h1>

        <UploadDataset
          setDataset={setDataset}
          setImageUrl={setImageUrl}
        />

        <DatasetInfo dataset={dataset} />

        <RecommendationPanel
          dataset={dataset}
          setImageUrl={setImageUrl}
          setXCol={setXCol}
          setYCol={setYCol}
          setChartType={setChartType}
        />

        <ChartBuilder
          dataset={dataset}
          setImageUrl={setImageUrl}
          xCol={xCol}
          yCol={yCol}
          chartType={chartType}
          setXCol={setXCol}
          setYCol={setYCol}
          setChartType={setChartType}
        />
      </div>

      <div className="right-panel">
        <PlotViewer imageUrl={imageUrl} />
      </div>

    </div>
  );
}

export default Dashboard;