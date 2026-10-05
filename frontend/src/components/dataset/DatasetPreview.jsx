import { useState } from "react";
import "./DatasetPreview.css";

function DatasetPreview({ previewRows, columns }) {
  const [showPreview, setShowPreview] = useState(false);

  if (!previewRows || !columns) {
    return null;
  }

  return (
    <section className="dataset-preview">
      <div className="dataset-preview__header">
        <div>
          <span className="section-label">Dataset</span>

          <h2 className="section-heading">
            Dataset Preview
          </h2>

          <p className="dataset-preview__subtitle">
            View the first 10 rows of your uploaded dataset.
          </p>
        </div>

        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => setShowPreview((prev) => !prev)}
        >
          {showPreview
            ? "Hide Dataset Preview"
            : "View Dataset Preview"}
        </button>
      </div>

      {showPreview && (
        <div className="dataset-preview__table-wrapper">
          <table className="dataset-preview__table">
            <thead>
              <tr>
                {columns.map((column, index) => {
                  const columnName =
                    typeof column === "string"
                      ? column
                      : column.name;

                  return (
                    <th key={index}>
                      {columnName}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {previewRows.slice(0, 10).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, columnIndex) => {
                    const columnName =
                      typeof column === "string"
                        ? column
                        : column.name;

                    return (
                      <td key={columnIndex}>
                        {row[columnName] !== null &&
                        row[columnName] !== undefined
                          ? String(row[columnName])
                          : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default DatasetPreview;