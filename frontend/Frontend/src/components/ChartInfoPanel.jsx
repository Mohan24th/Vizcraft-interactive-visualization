import GlassCard from "./common/GlassCard";
import { CHART_LABELS } from "../constants/chartTypes.jsx";
import "./ChartInfoPanel.css";

function ChartInfoPanel({ chartMeta }) {
  if (!chartMeta) return null;

  const items = [
    {
      label: "Chart Type",
      value: CHART_LABELS[chartMeta.chartType] ?? chartMeta.chartType,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      ),
    },
    {
      label: "X Axis",
      value: chartMeta.xCol ?? "—",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
          <path d="M4 20h16M4 20V4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "Y Axis",
      value: chartMeta.yCol ?? "—",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
          <path d="M4 20h16M20 20V4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "Data Points",
      value: chartMeta.dataPoints?.toLocaleString() ?? "—",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        </svg>
      ),
    },
    {
      label: "Generated",
      value: chartMeta.generatedAt?.toLocaleString() ?? "—",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <GlassCard className="chart-info" hover={false}>
      <h3 className="glass-card__title">Chart Information</h3>
      <div className="chart-info__grid">
        {items.map((item) => (
          <div key={item.label} className="chart-info__item">
            <span className="chart-info__icon">{item.icon}</span>
            <div>
              <span className="chart-info__label">{item.label}</span>
              <span className="chart-info__value">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export default ChartInfoPanel;
