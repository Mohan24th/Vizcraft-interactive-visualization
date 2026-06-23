import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import HeroSection from "../components/layout/HeroSection";
import UploadDataset from "../components/UploadDataset";
import UploadMetaPanel from "../components/UploadMetaPanel";
import DatasetSummary from "../components/DatasetSummary";
import DatasetPreview from "../components/DatasetPreview";
import DatasetInfo from "../components/DatasetInfo";
import ChartGallery from "../components/ChartGallery";
import ChartBuilder from "../components/ChartBuilder";
import PlotViewer from "../components/PlotViewer";
import ChartInfoPanel from "../components/ChartInfoPanel";
import DownloadActions from "../components/DownloadActions";
import RecommendationPanel from "../components/RecommendationPanel";
import { useDatasetAnalysis } from "../hooks/useDatasetAnalysis";
import { scrollToElement } from "../utils/scrollToElement";
import "./Dashboard.css";

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] },
  }),
};

function Dashboard() {
  const [dataset, setDataset] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadMeta, setUploadMeta] = useState(null);
  const [previewRows, setPreviewRows] = useState(null);
  const [chartMeta, setChartMeta] = useState(null);
  const [plotLoading, setPlotLoading] = useState(false);
  const [xCol, setXCol] = useState("");
  const [yCol, setYCol] = useState("");
  const [chartType, setChartType] = useState("histogram");

  const vizCanvasRef = useRef(null);
  const pendingScrollRef = useRef(false);

  const { analysis, loading: analysisLoading } = useDatasetAnalysis(
    dataset?.dataset_id
  );

  const scrollToVisualization = useCallback(() => {
    pendingScrollRef.current = true;
  }, []);

  useEffect(() => {
    if (!pendingScrollRef.current) return;
    if (!plotLoading && !imageUrl) return;

    const scroll = () => {
      if (vizCanvasRef.current) {
        scrollToElement(vizCanvasRef.current, 16);
      }
    };

    scroll();
    const t1 = window.setTimeout(scroll, 250);
    const t2 = window.setTimeout(() => {
      scroll();
      pendingScrollRef.current = false;
    }, 600);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [plotLoading, imageUrl]);

  const handleSetDataset = (data) => {
    setDataset(data);
    setImageUrl(null);
    setChartMeta(null);
    setXCol("");
    setYCol("");
    setChartType("histogram");
  };

  return (
    <motion.div
      className="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="dashboard__inner">
        <HeroSection />

        <div className="dashboard__workspace">
          <motion.aside
            className="dashboard__sidebar"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <UploadDataset
              setDataset={handleSetDataset}
              setImageUrl={setImageUrl}
              setUploadMeta={setUploadMeta}
              setPreviewRows={setPreviewRows}
            />
            <UploadMetaPanel dataset={dataset} uploadMeta={uploadMeta} />
          </motion.aside>

          <motion.div
            ref={vizCanvasRef}
            id="visualization-area"
            className="dashboard__viz"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            aria-live="polite"
          >
            <PlotViewer
              imageUrl={imageUrl}
              loading={plotLoading}
              chartMeta={chartMeta}
            />
          </motion.div>
        </div>

        {dataset && (
          <motion.div
            className="dashboard__sections"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <DatasetSummary
              dataset={dataset}
              analysis={analysis}
              loading={analysisLoading}
            />

            <ChartGallery
              chartType={chartType}
              setChartType={setChartType}
              setYCol={setYCol}
            />

            <ChartBuilder
              dataset={dataset}
              setImageUrl={setImageUrl}
              setChartMeta={setChartMeta}
              setPlotLoading={setPlotLoading}
              scrollToVisualization={scrollToVisualization}
              xCol={xCol}
              yCol={yCol}
              chartType={chartType}
              setXCol={setXCol}
              setYCol={setYCol}
            />

            {imageUrl && (
              <div className="dashboard__chart-meta">
                <ChartInfoPanel chartMeta={chartMeta} />
                <DownloadActions imageUrl={imageUrl} />
              </div>
            )}

            <DatasetPreview previewRows={previewRows} columns={dataset.columns} />

            <DatasetInfo dataset={dataset} />

            <RecommendationPanel
              dataset={dataset}
              setImageUrl={setImageUrl}
              setChartMeta={setChartMeta}
              setPlotLoading={setPlotLoading}
              scrollToVisualization={scrollToVisualization}
              setXCol={setXCol}
              setYCol={setYCol}
              setChartType={setChartType}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default Dashboard;
