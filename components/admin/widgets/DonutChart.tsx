import React, { useState } from 'react';

interface Segment {
  category: string;
  revenue: number;
  percentage: number;
  color: string;
}

interface DonutChartProps {
  data: Segment[];
  size?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, size = 140 }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  const r = 50;
  const cx = 60;
  const cy = 60;
  const circumference = 2 * Math.PI * r;

  // Pre-compute cumulative offsets
  let cumulative = 0;
  const segments = data.map(seg => {
    const offset = cumulative;
    cumulative += seg.percentage;
    return { ...seg, offset };
  });

  const hoveredSeg = segments.find(s => s.category === hovered);

  return (
    <div className="flex flex-col items-center gap-5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="18" />

        {/* Segments */}
        {segments.map((seg) => {
          const segLen = (seg.percentage / 100) * circumference;
          const dashOffset = -(seg.offset / 100) * circumference || 0;
          const isHov = hovered === seg.category;

          return (
            <circle
              key={seg.category}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={isHov ? 22 : 18}
              strokeDasharray={`${segLen} ${circumference - segLen}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ transition: 'stroke-width 0.2s ease', cursor: 'pointer' }}
              onMouseEnter={() => setHovered(seg.category)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}

        {/* Center text */}
        <circle cx={cx} cy={cy} r={32} fill="white" />
        {hoveredSeg ? (
          <React.Fragment key={`hovered-${hoveredSeg.category}`}>
            <text x={cx} y={cy - 5} textAnchor="middle" fontSize="10" fontWeight="700" fill="#0f172a">
              {hoveredSeg.percentage}%
            </text>
            <text x={cx} y={cy + 9} textAnchor="middle" fontSize="7.5" fill="#64748b">
              {hoveredSeg.category}
            </text>
          </React.Fragment>
        ) : (
          <React.Fragment key="default-all">
            <text x={cx} y={cy - 5} textAnchor="middle" fontSize="11" fontWeight="800" fill="#0f172a">
              100%
            </text>
            <text x={cx} y={cy + 9} textAnchor="middle" fontSize="7.5" fill="#64748b">
              All
            </text>
          </React.Fragment>
        )}
      </svg>

      {/* Legend */}
      <div className="w-full space-y-2">
        {data.map(seg => (
          <div
            key={seg.category}
            className="flex items-center justify-between cursor-pointer"
            onMouseEnter={() => setHovered(seg.category)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-xs text-slate-600 font-medium">{seg.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                ${(seg.revenue / 1000).toFixed(1)}k
              </span>
              <span
                className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: seg.color + '18', color: seg.color }}
              >
                {seg.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
