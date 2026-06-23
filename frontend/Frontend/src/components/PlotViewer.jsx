import { motion, AnimatePresence } from "framer-motion";
import "./PlotViewer.css";

function PlotViewer({ imageUrl, loading, chartMeta }) {
  if (loading) {
    return (
      <div className="viz-area viz-area--loading">
        <div className="viz-skeleton">
          <div className="viz-skeleton__shimmer" />
          <div className="viz-skeleton__bars">
            {[60, 80, 45, 90, 55, 70].map((h, i) => (
              <div key={i} className="viz-skeleton__bar" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <p className="viz-area__loading-text">Generating visualization...</p>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <motion.div
        className="viz-area viz-area--empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="viz-empty__illustration">
          <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="90" width="24" height="40" rx="4" fill="rgba(16,185,129,0.3)" />
            <rect x="52" y="60" width="24" height="70" rx="4" fill="rgba(16,185,129,0.5)" />
            <rect x="84" y="40" width="24" height="90" rx="4" fill="rgba(6,182,212,0.4)" />
            <rect x="116" y="70" width="24" height="60" rx="4" fill="rgba(16,185,129,0.35)" />
            <rect x="148" y="50" width="24" height="80" rx="4" fill="rgba(6,182,212,0.5)" />
            <motion.path
              d="M20 30 Q60 10 100 25 T180 20"
              stroke="rgba(16,185,129,0.6)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
          </svg>
        </div>
        <h3 className="viz-empty__title">Visualization Canvas</h3>
        <p className="viz-empty__text">
          Select a chart type and configure your axes below, then generate to preview your data here.
        </p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={imageUrl}
        className="viz-area viz-area--filled"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="viz-area__header">
          <div>
            <h3 className="viz-area__title">Visualization Preview</h3>
            {chartMeta?.generatedAt && (
              <span className="viz-area__timestamp">
                Generated {chartMeta.generatedAt.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <div className="viz-area__chart">
          <img src={imageUrl} alt="Generated visualization" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default PlotViewer;
