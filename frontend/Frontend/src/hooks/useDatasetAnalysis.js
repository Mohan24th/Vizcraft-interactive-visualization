import { useEffect, useState } from "react";
import API_BASE from "../api/api";

export function useDatasetAnalysis(datasetId) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!datasetId) {
      setAnalysis(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`${API_BASE}/analysis/${datasetId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.analysis) {
          setAnalysis(data.analysis);
        }
      })
      .catch(() => {
        if (!cancelled) setAnalysis(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [datasetId]);

  return { analysis, loading };
}
