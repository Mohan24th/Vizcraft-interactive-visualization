import { motion } from "framer-motion";
import GlassCard from "./common/GlassCard";
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <GlassCard className="upload-meta-card" hover={false}>
        <div className="upload-meta__filename">{fileName}</div>
        <div className="upload-meta__stats">
          <span className="meta-badge">
            <strong>{dataset.rows?.toLocaleString()}</strong> Rows
          </span>
          <span className="meta-badge">
            <strong>{dataset.columns?.length}</strong> Columns
          </span>
          {fileSize && (
            <span className="meta-badge">
              <strong>{formatFileSize(fileSize)}</strong>
            </span>
          )}
        </div>

        <div className="upload-meta">
          <div className="upload-meta__row">
            <span className="upload-meta__label">Dataset ID</span>
            <span className="upload-meta__value">{dataset.dataset_id}</span>
          </div>
          <div className="upload-meta__row">
            <span className="upload-meta__label">Status</span>
            <span className="status-badge status-badge--success">
              <span className="status-dot" />
              Ready
            </span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default UploadMetaPanel;
