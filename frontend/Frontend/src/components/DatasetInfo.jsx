import GlassCard from "./common/GlassCard";
import "./DatasetInfo.css";

function DatasetInfo({ dataset }) {
  if (!dataset) return null;

  const numeric = dataset.columns.filter((c) => c.type === "numeric").length;
  const categorical = dataset.columns.filter((c) => c.type === "categorical").length;

  return (
    <section className="column-schema">
      <h2 className="section-heading">Column Schema</h2>
      <GlassCard hover={false}>
        <div className="column-schema__summary">
          <span className="meta-badge">
            <strong>{numeric}</strong> Numeric
          </span>
          <span className="meta-badge">
            <strong>{categorical}</strong> Categorical
          </span>
        </div>
        <div className="column-list">
          {dataset.columns.map((col, i) => (
            <div key={i} className="column-item">
              <span className="column-item__name">{col.name}</span>
              <span className={`badge badge--${col.type}`}>
                {col.type}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}

export default DatasetInfo;
