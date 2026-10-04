import { motion } from "framer-motion";
import { useCountUp } from "../../hooks/useCountUp";
import "./StatCard.css";

function StatCard({ label, value, loading, delay = 0 }) {
  const numericValue = typeof value === "number" ? value : null;
  const animated = useCountUp(numericValue, 1200, numericValue != null && !loading);

  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <span className="stat-card__label">{label}</span>
      {loading ? (
        <div className="stat-card__skeleton" />
      ) : (
        <span className="stat-card__value">
          {numericValue != null ? animated.toLocaleString() : value ?? "—"}
        </span>
      )}
    </motion.div>
  );
}

export default StatCard;
