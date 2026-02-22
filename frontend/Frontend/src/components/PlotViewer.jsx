import "./PlotViewer.css";

function PlotViewer({ imageUrl }) {

  if (!imageUrl) return null;

  return (
    <div className="card">
      <h2>Visualization</h2>
      <img src={imageUrl} alt="plot" />
    </div>
  );
}

export default PlotViewer;