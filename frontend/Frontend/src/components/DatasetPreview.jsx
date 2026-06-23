import GlassCard from "./common/GlassCard";
import "./DatasetPreview.css";

function DatasetPreview({ previewRows, columns }) {
  if (!previewRows?.length) return null;

  const headers = columns?.map((c) => c.name) ?? Object.keys(previewRows[0] ?? {});

  return (
    <section className="dataset-preview">
      <h2 className="section-heading">Dataset Preview</h2>
      <GlassCard className="dataset-preview__card" hover={false}>
        <p className="glass-card__subtitle">
          First {previewRows.length} rows of your uploaded dataset
        </p>
        <div className="dataset-preview__scroll">
          <table className="data-table">
            <thead>
              <tr>
                {headers.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, i) => (
                <tr key={i}>
                  {headers.map((col) => (
                    <td key={col}>{row[col] ?? "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </section>
  );
}

export default DatasetPreview;
