import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse";
import API_BASE from "../api/api";
import GlassCard from "./common/GlassCard";
import "./UploadDataset.css";

function UploadDataset({ setDataset, setImageUrl, setUploadMeta, setPreviewRows }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const allowedTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const parsePreview = useCallback((selectedFile) => {
    if (!selectedFile || !selectedFile.name.toLowerCase().endsWith(".csv")) {
      setPreviewRows?.(null);
      return;
    }

    Papa.parse(selectedFile, {
      header: true,
      preview: 10,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data?.length) {
          setPreviewRows?.(results.data);
        } else {
          setPreviewRows?.(null);
        }
      },
      error: () => setPreviewRows?.(null),
    });
  }, [setPreviewRows]);

  const handleFile = (selected) => {
    if (!selected) return;
    setFile(selected);
    setSuccess(false);
    parsePreview(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const uploadDataset = async () => {
    if (!file) return;

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
      alert("Invalid file format. Please upload a CSV or Excel file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch(`${API_BASE}/data/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setDataset(data);
        setImageUrl(null);
        setUploadMeta?.({
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date(),
        });
        setSuccess(true);
      } else {
        alert(data.detail || "Upload failed.");
      }
    } catch {
      alert("Upload failed.");
    }

    setLoading(false);
  };

  return (
    <GlassCard className="upload-card" hover={false}>
      <span className="section-label">Step 1</span>
      <h2 className="glass-card__title">Upload Dataset</h2>
      <p className="glass-card__subtitle">
        Drop a CSV or Excel file to begin exploring your data.
      </p>

      <div
        className={`upload-dropzone ${dragOver ? "upload-dropzone--active" : ""} ${file ? "upload-dropzone--has-file" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => handleFile(e.target.files?.[0])}
          hidden
        />

        <div className="upload-dropzone__icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {file ? (
          <div className="upload-dropzone__file">
            <span className="upload-dropzone__filename">{file.name}</span>
            <span className="upload-dropzone__size">{formatFileSize(file.size)}</span>
          </div>
        ) : (
          <>
            <p className="upload-dropzone__text">
              <strong>Click to browse</strong> or drag and drop
            </p>
            <p className="upload-dropzone__hint">CSV, XLS, XLSX supported</p>
          </>
        )}
      </div>

      <motion.button
        className="btn btn--primary upload-btn"
        onClick={uploadDataset}
        disabled={!file || loading}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <span className="btn-loading">
            <span className="btn-spinner" />
            Uploading...
          </span>
        ) : (
          "Upload Dataset"
        )}
      </motion.button>

      <AnimatePresence>
        {success && file && (
          <motion.div
            className="upload-success"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="upload-success__header">
              <span className="status-badge status-badge--success">
                <span className="status-dot" />
                Uploaded Successfully
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

export default UploadDataset;
