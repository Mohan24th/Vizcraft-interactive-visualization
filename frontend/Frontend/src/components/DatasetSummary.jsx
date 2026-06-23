import StatCard from "./common/StatCard";
import "./DatasetSummary.css";

function DatasetSummary({ dataset, analysis, loading }) {
  if (!dataset) return null;

  const numericCount =
    analysis?.numeric_columns?.length ??
    dataset.columns.filter((c) => c.type === "numeric").length;

  const categoricalCount =
    analysis?.categorical_columns?.length ??
    dataset.columns.filter((c) => c.type === "categorical").length;

  const missingValues =
    analysis?.total_missing_values ?? null;

  return (
    <section className="dataset-summary">
      <h2 className="section-heading">Dataset Summary</h2>
      <div className="dataset-summary__grid">
        <StatCard label="Rows" value={dataset.rows} loading={false} delay={0} />
        <StatCard label="Columns" value={dataset.columns.length} loading={false} delay={0.05} />
        <StatCard label="Numeric" value={numericCount} loading={loading && !analysis} delay={0.1} />
        <StatCard label="Categorical" value={categoricalCount} loading={loading && !analysis} delay={0.15} />
        <StatCard
          label="Missing"
          value={missingValues}
          loading={loading && missingValues == null}
          delay={0.2}
        />
      </div>
    </section>
  );
}

export default DatasetSummary;
