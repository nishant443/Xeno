export const buildMockList = (count = 0, prefix = 'Item') => {
  return Array.from({ length: Math.min(count, 10) }).map((_, index) => ({
    id: `${prefix}-${index + 1}`,
    name: `${prefix} ${index + 1}`,
    total: Math.round(Math.random() * 1000) / 100,
    updatedAt: new Date(Date.now() - index * 3600 * 1000).toISOString()
  }));
};

export const deriveChartSeries = (metric = 0, label = 'Metric') => {
  const safeMetric = Number(metric) || 0;
  const segments = Math.max(Math.min(safeMetric, 5), 1);
  return Array.from({ length: segments }).map((_, idx) => ({
    name: `${label} ${idx + 1}`,
    value: Math.round((safeMetric / segments) * (0.5 + Math.random()))
  }));
};
