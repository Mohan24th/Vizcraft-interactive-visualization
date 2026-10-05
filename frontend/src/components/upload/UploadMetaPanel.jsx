import { motion } from "framer-motion";
import "./UploadDataset.css";

function UploadMetaPanel({ dataset, uploadMeta }) {
  if (!dataset) return null;

  const fileName = uploadMeta?.fileName ?? "Dataset";
  const fileSize = uploadMeta?.fileSize;

  const formatFileSize = (bytes) => {
    if (!bytes) return null;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <motion.div
      className="dataset-status-pill"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="dataset-status-pill__info">
        <div className="dataset-status-pill__icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <div className="dataset-status-pill__details">
          <span className="dataset-status-pill__name">{fileName}</span>
          <span className="dataset-status-pill__meta">
            {fileSize && <span>{formatFileSize(fileSize)} · </span>}
            <span className="dataset-status-pill__id">ID: {dataset.dataset_id?.slice(0, 8)}</span>
          </span>
        </div>
      </div>

      <div className="status-badge status-badge--success">
        <span className="status-dot" />
        Ready
      </div>
    </motion.div>
  );
}

export default UploadMetaPanel;
