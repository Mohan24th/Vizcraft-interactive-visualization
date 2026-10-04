import { useState } from "react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import "./DownloadActions.css";

function DownloadActions({ imageUrl }) {
  const [pngLoading, setPngLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  if (!imageUrl) return null;

  const downloadPNG = async () => {
    setPngLoading(true);
    try {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "vizcraft-plot.png";
      link.click();
    } finally {
      setTimeout(() => setPngLoading(false), 600);
    }
  };

  const downloadPDF = async () => {
    setPdfLoading(true);
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const pdf = new jsPDF({
        orientation: img.width > img.height ? "landscape" : "portrait",
        unit: "px",
        format: [img.width, img.height],
      });

      pdf.addImage(img, "PNG", 0, 0, img.width, img.height);
      pdf.save("vizcraft-plot.pdf");
    } catch {
      alert("PDF download failed. Try downloading PNG instead.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <section className="download-actions">
      <h2 className="section-heading">Export</h2>
      <div className="download-actions__buttons">
        <motion.button
          className="btn btn--secondary"
          onClick={downloadPNG}
          disabled={pngLoading}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {pngLoading ? (
            <span className="btn-loading"><span className="btn-spinner" /> Exporting...</span>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
                <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download PNG
            </>
          )}
        </motion.button>

        <motion.button
          className="btn btn--secondary"
          onClick={downloadPDF}
          disabled={pdfLoading}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {pdfLoading ? (
            <span className="btn-loading"><span className="btn-spinner" /> Exporting...</span>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                <path d="M14 2v6h6M10 13h4M10 17h4M10 9h2" strokeLinecap="round" />
              </svg>
              Download PDF
            </>
          )}
        </motion.button>
      </div>
    </section>
  );
}

export default DownloadActions;
