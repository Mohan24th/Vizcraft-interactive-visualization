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
          <h3 className="section-heading">
            Dataset Preview
          </h3>

          <p className="dataset-preview__subtitle">
            First 10 rows of your uploaded dataset.
          </p>
        </div>

        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => setShowPreview((prev) => !prev)}
        >
          {showPreview ? "Hide Dataset Preview" : "View Dataset Preview"}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: showPreview ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
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