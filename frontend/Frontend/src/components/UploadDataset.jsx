import { useState } from "react";
import API_BASE from "../api/api";
import "./UploadDataset.css";

function UploadDataset({ setDataset, setImageUrl }) {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadDataset = async () => {

    if (!file) {
      alert("Please select a file.");
      return;
    }

    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file format. Please upload a CSV or Excel file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/data/upload`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setDataset(data);
        setImageUrl(null);
      } else {
        alert(data.detail || "Upload failed.");
      }

    } catch (err) {
      alert("Upload failed.");
    }

    setLoading(false);
  };

  return (
    <div className="card">
      <h2>Upload Dataset</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadDataset}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

export default UploadDataset;