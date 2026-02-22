import { useState } from "react";
import UploadDataset from "../components/UploadDataset";
import DatasetInfo from "../components/DatasetInfo";
import ChartBuilder from "../components/ChartBuilder";
import PlotViewer from "../components/PlotViewer";
import RecommendationPanel from "../components/RecommendationPanel";

function Dashboard() {

  const [dataset, setDataset] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  return (
    <div style={{ padding: 40 }}>
      <h1>VizCraft</h1>

      <UploadDataset setDataset={setDataset} setImageUrl={setImageUrl} />
      <DatasetInfo dataset={dataset} />
      <RecommendationPanel dataset={dataset} setImageUrl={setImageUrl} />
      <ChartBuilder dataset={dataset} setImageUrl={setImageUrl} />
      <PlotViewer imageUrl={imageUrl} />
    </div>
  );
}

export default Dashboard;