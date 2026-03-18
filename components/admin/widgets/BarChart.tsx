import React, { useState } from 'react';

interface BarChartProps {
  data: Array<{ month: string; revenue: number; orders: number }>;
  activeMetric: 'revenue' | 'orders';
}

const BarChart: React.FC<BarChartProps> = ({ data, activeMetric }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const values = data.map(d => d[activeMetric]);
  const max = Math.max(...values);

  const svgW = 620;
  const svgH = 200;
  const padL = 48;
  const padB = 28;
  const padT = 10;
  const chartW = svgW - padL;
  const chartH = svgH - padB - padT;
  const slotW = chartW / data.length;
  const barW = slotW * 0.55;
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  const fmt = (v: number) =>
    activeMetric === 'revenue'
      ? `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`
      : v.toFixed(0);

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      className="w-full"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Grid + Y-axis labels */}
      {yTicks.map((ratio, i) => {
        const y = padT + chartH - ratio * chartH;
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={svgW} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#94a3b8">
              {fmt(ratio * max)}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const value = d[activeMetric];
        const bH = max > 0 ? Math.max(4, (value / max) * chartH) : 4;
        const x = padL + i * slotW + (slotW - barW) / 2;
        const y = padT + chartH - bH;
        const isHovered = hoveredIdx === i;

        return (
          <g
            key={d.month}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{ cursor: 'pointer' }}
          >
            {/* Hover bg */}
            {isHovered && (
              <rect
                x={padL + i * slotW + 2}
                y={padT}
                width={slotW - 4}
                height={chartH}
                rx={6}
                fill="#f8fafc"
              />
            )}
            {/* Bar */}
            <rect
              x={x}
              y={y}
              width={barW}
              height={bH}
              rx={5}
              fill={isHovered ? '#1d4ed8' : '#2563eb'}
              opacity={hoveredIdx !== null && !isHovered ? 0.45 : 1}
              style={{ transition: 'fill 0.15s, opacity 0.15s' }}
            />
            {/* Tooltip on hover */}
            {isHovered && (
              <g>
                <rect
                  x={x + barW / 2 - 28}
                  y={y - 26}
                  width={56}
                  height={20}
                  rx={5}
                  fill="#0f172a"
                />
                <text
                  x={x + barW / 2}
                  y={y - 12}
                  textAnchor="middle"
                  fontSize="9"
                  fill="white"
                  fontWeight="600"
                >
                  {activeMetric === 'revenue' ? `$${(value / 1000).toFixed(1)}k` : value}
                </text>
              </g>
            )}
            {/* X-axis label */}
            <text
              x={padL + i * slotW + slotW / 2}
              y={svgH - 6}
              textAnchor="middle"
              fontSize="9"
              fill={isHovered ? '#334155' : '#94a3b8'}
              fontWeight={isHovered ? '600' : '400'}
            >
              {d.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default BarChart;
