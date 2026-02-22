import { useState } from "react";
import API_BASE from "../api/api";
import "./UploadDataset.css";

function UploadDataset({ setDataset, setImageUrl }) {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadDataset = async () => {
    if (!file) return alert("Select a file");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    const res = await fetch(`${API_BASE}/data/upload`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setDataset(data);
    setImageUrl(null);
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