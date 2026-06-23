export const CHART_TYPES = [
  {
    id: "bar",
    label: "Bar Chart",
    description: "Compare values across categories",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="12" width="4" height="9" rx="1" />
        <rect x="10" y="7" width="4" height="14" rx="1" />
        <rect x="17" y="3" width="4" height="18" rx="1" />
      </svg>
    ),
  },
  {
    id: "line",
    label: "Line Chart",
    description: "Track trends over continuous data",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="3 17 9 11 13 15 21 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "scatter",
    label: "Scatter Plot",
    description: "Explore relationships between variables",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="6" cy="16" r="2" fill="currentColor" />
        <circle cx="12" cy="10" r="2" fill="currentColor" />
        <circle cx="18" cy="6" r="2" fill="currentColor" />
        <circle cx="15" cy="18" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "histogram",
    label: "Histogram",
    description: "Visualize distribution of numeric data",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="14" width="3" height="8" rx="0.5" />
        <rect x="6" y="10" width="3" height="12" rx="0.5" />
        <rect x="10" y="6" width="3" height="16" rx="0.5" />
        <rect x="14" y="10" width="3" height="12" rx="0.5" />
        <rect x="18" y="14" width="3" height="8" rx="0.5" />
      </svg>
    ),
  },
  {
    id: "boxplot",
    label: "Box Plot",
    description: "Summarize statistical distributions",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="12" y1="3" x2="12" y2="21" />
        <rect x="8" y="9" width="8" height="6" rx="1" />
        <line x1="6" y1="12" x2="8" y2="12" />
        <line x1="16" y1="12" x2="18" y2="12" />
      </svg>
    ),
  },
  {
    id: "heatmap",
    label: "Heatmap",
    description: "Reveal correlation patterns",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" opacity="0.9" />
        <rect x="14" y="3" width="7" height="7" rx="1" opacity="0.5" />
        <rect x="3" y="14" width="7" height="7" rx="1" opacity="0.5" />
        <rect x="14" y="14" width="7" height="7" rx="1" opacity="0.9" />
      </svg>
    ),
  },
  {
    id: "pairplot",
    label: "Pair Plot",
    description: "Multi-variable relationship matrix",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
];

export const CHART_LABELS = Object.fromEntries(
  CHART_TYPES.map((c) => [c.id, c.label])
);
