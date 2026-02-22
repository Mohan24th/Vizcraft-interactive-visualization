import "./DatasetInfo.css";

function DatasetInfo({ dataset }) {

  if (!dataset) return null;

  return (
    <div className="card">
      <h2>Dataset Info</h2>
      <p><b>Rows:</b> {dataset.rows}</p>

      <h3>Columns</h3>
      <ul>
        {dataset.columns.map((col, i) => (
          <li key={i}>
            {col.name} — <b>{col.type}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DatasetInfo;