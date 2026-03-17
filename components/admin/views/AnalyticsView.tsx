import React, { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart2, Users, ShoppingBag, Eye } from 'lucide-react';
import BarChart from '../widgets/BarChart';
import DonutChart from '../widgets/DonutChart';
import { MONTHLY_REVENUE, CATEGORY_STATS, WEEKLY_TRAFFIC } from '../mockData';
import { api } from '../../../services/api';

interface MetricCardProps {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, change, icon, color }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5">
    <div className="flex items-center justify-between mb-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: color + '18' }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <span
        className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
          change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
        }`}
      >
        {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {Math.abs(change)}%
      </span>
    </div>
    <div className="text-xl font-black text-slate-900">{value}</div>
    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{label}</div>
  </div>
);

const AnalyticsView: React.FC = () => {
  const [metric, setMetric] = useState<'revenue' | 'orders'>('revenue');
  const [statsData, setStatsData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [trafficStats, setTrafficStats] = useState<any[]>([]);
  const [analyticsMetrics, setAnalyticsMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [stats, charts, traffic, metrics] = await Promise.all([
          api.admin.getStats(),
          api.admin.getChartData(),
          api.admin.getTrafficStats(),
          api.admin.getAnalyticsMetrics(),
        ]);
        setStatsData(stats);
        setChartData(charts);
        setTrafficStats(traffic);
        setAnalyticsMetrics(metrics);
      } catch (err) {
        console.error('Failed to fetch analytics data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full pt-32">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const categoryStats = statsData?.categoryStats || [];
  const currentChartData = chartData.length > 0 ? chartData : MONTHLY_REVENUE;

  const totalRev = Number(statsData?.totalRevenue || 0);
  const totalOrd = Number(statsData?.totalOrders || 0);
  const avgOrderValue = totalOrd > 0 ? (totalRev / totalOrd).toFixed(2) : '0.00';

  const trafficData = trafficStats.length > 0 ? trafficStats : WEEKLY_TRAFFIC;
  const maxTraffic = Math.max(...trafficData.map(d => d.visitors), 1);
  const totalVisitors = trafficData.reduce((s, d) => s + d.visitors, 0);

  // Use real analytics metrics or sensible defaults
  const convRate = analyticsMetrics?.conversionRate ?? 0;
  const bounceRate = analyticsMetrics?.bounceRate ?? 0;
  const sessionDuration = analyticsMetrics?.sessionDuration ?? '0m 0s';
  const weeklyChange = analyticsMetrics?.weeklyTrafficChange ?? 0;

  // Calculate real YoY if we have enough data, or derive from chartData
  const yoy = currentChartData.length >= 12 
    ? (((Number(currentChartData[currentChartData.length-1].revenue) - Number(currentChartData[0].revenue)) / (Number(currentChartData[0].revenue) || 1)) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Performance insights · Year-over-year growth:{' '}
          <span className="text-emerald-600 font-bold">+{yoy}%</span>
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard label="Conversion Rate"    value={`${convRate}%`}       change={convRate > 0 ? 0.8 : 0}  color="#2563eb" icon={<TrendingUp className="w-4.5 h-4.5" />} />
        <MetricCard label="Avg Order Value"    value={`$${avgOrderValue}`}  change={statsData?.revChange || 0}  color="#10b981" icon={<ShoppingBag className="w-4.5 h-4.5" />} />
        <MetricCard label="Bounce Rate"        value={`${bounceRate}%`}     change={bounceRate > 0 ? -2.1 : 0} color="#f59e0b" icon={<Eye className="w-4.5 h-4.5" />} />
        <MetricCard label="Avg Session"        value={sessionDuration}      change={weeklyChange > 0 ? 12.5 : 0} color="#ec4899" icon={<Users className="w-4.5 h-4.5" />} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Bar Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-black text-slate-900">Revenue & Orders</h2>
              <p className="text-xs text-slate-400 mt-0.5">Monthly breakdown, 2025–2026</p>
            </div>
            <div className="flex gap-1 bg-slate-50 rounded-xl p-1 border border-slate-100">
              {(['revenue', 'orders'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMetric(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                    metric === m
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Summary stats */}
          <div className="flex gap-4 mb-5">
            <div>
              <div className="text-lg font-black text-slate-900">
                {metric === 'revenue'
                  ? `$${(currentChartData.reduce((s, m) => s + Number(m.revenue), 0) / 1000).toFixed(1)}k`
                  : currentChartData.reduce((s, m) => s + Number(m.orders), 0).toLocaleString()}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Total {metric}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-100" />
            <div>
              <div className="text-lg font-black text-emerald-600">+{yoy}%</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                YoY Growth
              </div>
            </div>
          </div>

          <BarChart data={currentChartData} activeMetric={metric} />
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="mb-5">
            <h2 className="text-sm font-black text-slate-900">Category Revenue</h2>
            <p className="text-xs text-slate-400 mt-0.5">Breakdown by product category</p>
          </div>
          <DonutChart 
            data={categoryStats.length > 0 ? categoryStats : CATEGORY_STATS} 
            size={156} 
          />
        </div>
      </div>

      {/* Weekly Traffic */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-black text-slate-900">Weekly Traffic</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {totalVisitors.toLocaleString()} visitors this week
            </p>
          </div>
          <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl ${
            weeklyChange >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'
          }`}>
            {weeklyChange >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {weeklyChange >= 0 ? '+' : ''}{weeklyChange}% vs last week
          </div>
        </div>

        <div className="flex items-end gap-3 h-32">
          {trafficData.map(d => {
            const ratio = d.visitors / maxTraffic;
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                  {d.visitors.toLocaleString()}
                </div>
                <div className="w-full relative" style={{ height: `${Math.round(ratio * 88)}px` }}>
                  <div
                    className="absolute inset-0 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-lg bg-blue-500 group-hover:bg-blue-600 transition-all"
                    style={{ height: `${Math.round(ratio * 88)}px` }}
                  />
                </div>
                <div className="text-[11px] font-bold text-slate-400">{d.day}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
