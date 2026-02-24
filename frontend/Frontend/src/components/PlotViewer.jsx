import "./PlotViewer.css";

function PlotViewer({ imageUrl }) {

  if (!imageUrl) return (
    <div className="plot-empty">
      <h2>No Visualization Yet</h2>
      <p>Generate a plot to see it here.</p>
    </div>
  );

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "vizcraft-plot.png";
    link.click();
  };

  return (
    <div className="plot-container">
      <div className="plot-header">
        <h2>Visualization</h2>
        <button className="download-btn" onClick={downloadImage}>
          Download PNG
        </button>
      </div>

      <img src={imageUrl} alt="Generated Plot" />
    </div>
  );
}

export default PlotViewer;