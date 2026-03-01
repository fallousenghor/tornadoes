// Sparkline Component - AEVUM Enterprise ERP
// Mini line chart for KPI trends

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

export const Sparkline = ({ 
  data, 
  color = '#6490ff', 
  height = 28 
}: SparklineProps) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg 
      width="100%" 
      height={height}
      viewBox={`0 0 100 ${height}`}
    >
      <polyline 
        points={points} 
        fill="none" 
        stroke={color} 
        strokeWidth={1.8} 
        strokeLinejoin="round" 
      />
    </svg>
  );
};

export default Sparkline;

