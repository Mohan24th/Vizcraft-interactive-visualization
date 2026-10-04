import { motion } from "framer-motion";
import "./GlassCard.css";

function GlassCard({ children, className = "", hover = true, ...props }) {
  return (
    <motion.div
      className={`glass-card ${hover ? "glass-card--hover" : ""} ${className}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default GlassCard;
