import { motion } from "framer-motion";
import { CHART_TYPES } from "../../constants/chartTypes.jsx";
import "./ChartGallery.css";

function ChartGallery({
  chartType,
  setChartType,
  setYCol,
}) {
  return (
    <section className="chart-gallery">

      <div className="chart-gallery__header">
        <h3 className="section-heading">
          Choose a chart type
        </h3>

        <p className="glass-card__subtitle">
          Select the visualization that best fits your analysis.
        </p>
      </div>

      <div className="chart-gallery__grid">
        {CHART_TYPES.map((chart, i) => {

          const selected =
            chartType === chart.id;

          return (
            <motion.button
              key={chart.id}
              type="button"

              className={`chart-card ${
                selected
                  ? "chart-card--selected"
                  : ""
              }`}

              onClick={() => {

                setChartType(chart.id);

                if (
                  chart.id === "histogram" ||
                  chart.id === "heatmap" ||
                  chart.id === "pairplot"
                ) {
                  setYCol?.("");
                }
              }}

              initial={{
                opacity: 0,
                y: 16,
              }}

              whileInView={{
                opacity: 1,
                y: 0,
              }}

              viewport={{
                once: true,
              }}

              transition={{
                duration: 0.35,
                delay: i * 0.05,
              }}

              whileHover={{
                scale: 1.02,
              }}

              whileTap={{
                scale: 0.98,
              }}
            >

              <div className="chart-card__icon">
                {chart.icon}
              </div>

              <span className="chart-card__title">
                {chart.label}
              </span>

              <span className="chart-card__desc">
                {chart.description}
              </span>

              {selected && (
                <span className="chart-card__check">
                  Selected
                </span>
              )}

            </motion.button>
          );
        })}
      </div>

    </section>
  );
}

export default ChartGallery;