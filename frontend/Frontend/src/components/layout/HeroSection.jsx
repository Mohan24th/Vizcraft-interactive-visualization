import { motion } from "framer-motion";
import "./HeroSection.css";

function HeroSection() {
  return (
    <motion.header
      className="hero"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__content">
        <motion.div
          className="hero__badge"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Data Visualization Platform
        </motion.div>
        <h1 className="hero__title">
          <span className="hero__title-gradient">VizCraft</span>
        </h1>
        <p className="hero__tagline">
          Transform raw datasets into meaningful visualizations in seconds.
        </p>
      </div>
    </motion.header>
  );
}

export default HeroSection;
