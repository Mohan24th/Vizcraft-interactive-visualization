import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

import HeroSection from "../components/layout/HeroSection";

import UploadDataset from "../components/upload/UploadDataset";
import UploadMetaPanel from "../components/upload/UploadMetaPanel";

import DatasetSummary from "../components/dataset/DatasetSummary";
import DatasetPreview from "../components/dataset/DatasetPreview";
import DatasetInfo from "../components/dataset/DatasetInfo";

import ChartGallery from "../components/visualization/ChartGallery";
import ChartBuilder from "../components/visualization/ChartBuilder";
import PlotViewer from "../components/visualization/PlotViewer";
import ChartInfoPanel from "../components/visualization/ChartInfoPanel";
import DownloadActions from "../components/visualization/DownloadActions";
import RecommendationPanel from "../components/visualization/RecommendationPanel";

import AIInsights from "../components/insights/AIInsights";
import NLVisualization from "../components/ai/NLVisualization";

import { useDatasetAnalysis } from "../hooks/useDatasetAnalysis";
import { scrollToElement } from "../utils/scrollToElement";

import "./Dashboard.css";

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },

  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

function Dashboard() {
  // =========================
  // DATASET STATE
  // =========================

  const [dataset, setDataset] = useState(null);
  const [uploadMeta, setUploadMeta] = useState(null);
  const [previewRows, setPreviewRows] = useState(null);

  // =========================
  // VISUALIZATION STATE
  // =========================

  const [imageUrl, setImageUrl] = useState(null);
  const [chartMeta, setChartMeta] = useState(null);
  const [plotLoading, setPlotLoading] = useState(false);

  const [xCol, setXCol] = useState("");
  const [yCol, setYCol] = useState("");
  const [chartType, setChartType] = useState("histogram");

  // =========================
  // SCROLL STATE
  // =========================

  const vizCanvasRef = useRef(null);
  const pendingScrollRef = useRef(false);

  // =========================
  // DATASET ANALYSIS
  // =========================

  const {
    analysis,
    loading: analysisLoading,
  } = useDatasetAnalysis(dataset?.dataset_id);

  // =========================
  // SCROLL TO VISUALIZATION
  // =========================

  const scrollToVisualization = useCallback(() => {
    pendingScrollRef.current = true;
  }, []);

  useEffect(() => {
    if (!pendingScrollRef.current) {
      return;
    }

    if (!plotLoading && !imageUrl) {
      return;
    }

    const scroll = () => {
      if (vizCanvasRef.current) {
        scrollToElement(vizCanvasRef.current, 16);
      }
    };

    scroll();

    const timeout1 = window.setTimeout(scroll, 250);

    const timeout2 = window.setTimeout(() => {
      scroll();
      pendingScrollRef.current = false;
    }, 600);

    return () => {
      window.clearTimeout(timeout1);
      window.clearTimeout(timeout2);
    };
  }, [plotLoading, imageUrl]);

  // =========================
  // DATASET UPLOAD
  // =========================

  const handleSetDataset = (data) => {
    setDataset(data);

    // Reset visualization state for new dataset
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

        {/* =========================
            HERO
        ========================= */}

        <HeroSection />

        {/* =========================
            01 — DATASET
        ========================= */}

        <section className="product-section product-section--dataset">

          <div className="product-section__header">
            <div>
              <span className="product-section__eyebrow">
                01 · DATASET
              </span>

              <h2 className="product-section__title">
                Start with your data
              </h2>

              <p className="product-section__description">
                Upload a CSV or Excel file and VizCraft will
                automatically understand its structure.
              </p>
            </div>
          </div>

          <div className="dashboard__workspace">

            {/* UPLOAD */}
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

              <UploadMetaPanel
                dataset={dataset}
                uploadMeta={uploadMeta}
              />
            </motion.aside>

            {/* VISUALIZATION PREVIEW */}
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
        </section>

        {/* =========================
            EVERYTHING BELOW REQUIRES DATASET
        ========================= */}

        {dataset && (
          <motion.div
            className="dashboard__sections"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
          >

            {/* =========================
                02 — UNDERSTAND
            ========================= */}

            <section className="product-section">

              <div className="product-section__header">
                <div>
                  <span className="product-section__eyebrow">
                    02 · UNDERSTAND
                  </span>

                  <h2 className="product-section__title">
                    Understand your dataset
                  </h2>

                  <p className="product-section__description">
                    Get a quick overview of the structure, quality,
                    patterns, and contents of your data.
                  </p>
                </div>
              </div>

              <div className="product-section__content">

                <DatasetSummary
                  dataset={dataset}
                  analysis={analysis}
                  loading={analysisLoading}
                />

                <AIInsights
                  dataset={dataset}
                />

                <DatasetPreview
                  previewRows={previewRows}
                  columns={dataset.columns}
                />

              </div>

            </section>

            {/* =========================
                03 — VISUALIZE
            ========================= */}

            <section className="product-section">

              <div className="product-section__header">
                <div>
                  <span className="product-section__eyebrow">
                    03 · VISUALIZE
                  </span>

                  <h2 className="product-section__title">
                    Turn your data into a visualization
                  </h2>

                  <p className="product-section__description">
                    Use AI to describe what you want, or configure
                    the chart manually.
                  </p>
                </div>
              </div>

              <div className="product-section__content">

                {/* NATURAL LANGUAGE AI */}
                <NLVisualization
                  dataset={dataset}
                  setImageUrl={setImageUrl}
                  setChartMeta={setChartMeta}
                  setPlotLoading={setPlotLoading}
                  scrollToVisualization={scrollToVisualization}
                  setXCol={setXCol}
                  setYCol={setYCol}
                  setChartType={setChartType}
                />

                {/* MANUAL CHART TYPE */}
                <ChartGallery
                  chartType={chartType}
                  setChartType={setChartType}
                  setYCol={setYCol}
                />

                {/* MANUAL CONFIGURATION */}
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

                {/* GENERATED CHART INFORMATION */}
                {imageUrl && (
                  <div className="dashboard__chart-meta">

                    <ChartInfoPanel
                      chartMeta={chartMeta}
                    />

                    <DownloadActions
                      imageUrl={imageUrl}
                    />

                  </div>
                )}

              </div>

            </section>

            {/* =========================
                04 — DISCOVER
            ========================= */}

            <section className="product-section">

              <div className="product-section__header">
                <div>
                  <span className="product-section__eyebrow">
                    04 · DISCOVER
                  </span>

                  <h2 className="product-section__title">
                    Discover more from your data
                  </h2>

                  <p className="product-section__description">
                    Explore automatically suggested visualizations
                    and inspect the detected column schema.
                  </p>
                </div>
              </div>

              <div className="product-section__content">

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

                <DatasetInfo
                  dataset={dataset}
                />

              </div>

            </section>

          </motion.div>
        )}

      </div>
    </motion.div>
  );
}

export default Dashboard;