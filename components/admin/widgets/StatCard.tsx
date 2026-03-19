import React from 'react';
import SparklineChart from './SparklineChart';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  sparkData: number[];
  sparkColor: string;
  icon: React.ReactNode;
  iconBg: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  sparkData,
  sparkColor,
  icon,
  iconBg,
}) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
        <div className="hidden xs:block">
          <SparklineChart data={sparkData} color={sparkColor} width={window.innerWidth < 640 ? 60 : 88} height={38} />
        </div>
      </div>

      <div className="text-xl sm:text-[1.6rem] font-black text-slate-900 tracking-tight leading-none mb-1">
        {value}
      </div>
      <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 sm:mb-3">
        {title}
      </div>

      <div className="flex items-center gap-1.5">
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            isPositive
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-red-50 text-red-500'
          }`}
        >
          {isPositive ? '▲' : '▼'} {Math.abs(change)}%
        </span>
        <span className="text-[11px] text-slate-400">vs last month</span>
      </div>
    </div>
  );
};

export default StatCard;
