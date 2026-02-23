import "./DatasetInfo.css";

function DatasetInfo({ dataset }) {

  if (!dataset) return null;

  return (
    <div className="card">
      <h2>Dataset Info</h2>
      <p><b>Rows:</b> {dataset.rows}</p>

      <h3>Columns</h3>

      <div className="column-list">
        {dataset.columns.map((col, i) => (
          <div key={i} className="column-item">
            <span>{col.name}</span>

            <span
              className={
                col.type === "numeric"
                  ? "badge numeric"
                  : "badge categorical"
              }
            >
              {col.type.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DatasetInfo;