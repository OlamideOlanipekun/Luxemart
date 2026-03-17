import React, { useState } from 'react';
import {
  DollarSign, ShoppingBag, Users, Package,
  ShoppingCart, Clock, Star, Truck, AlertTriangle, CheckCircle2, UserPlus,
} from 'lucide-react';
import StatCard from '../widgets/StatCard';
import BarChart from '../widgets/BarChart';
import DonutChart from '../widgets/DonutChart';
import {
  MONTHLY_REVENUE, CATEGORY_STATS,
  REVENUE_SPARKLINE, ORDERS_SPARKLINE, CUSTOMERS_SPARKLINE, PRODUCTS_SPARKLINE,
} from '../mockData';
import { api } from '../../../services/api';

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  delivered:  { label: 'Delivered',  cls: 'bg-emerald-50 text-emerald-600' },
  shipped:    { label: 'Shipped',    cls: 'bg-blue-50 text-blue-600' },
  processing: { label: 'Processing', cls: 'bg-amber-50 text-amber-600' },
  pending:    { label: 'Pending',    cls: 'bg-slate-100 text-slate-500' },
};

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  order:  <ShoppingBag className="w-3.5 h-3.5" />,
  user:   <UserPlus className="w-3.5 h-3.5" />,
  review: <Star className="w-3.5 h-3.5" />,
  alert:  <AlertTriangle className="w-3.5 h-3.5" />,
};

const OverviewView: React.FC<{ onNavigate?: (view: string) => void }> = ({ onNavigate }) => {
  const [metric, setMetric] = useState<'revenue' | 'orders'>('revenue');
  const [statsData, setStatsData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [stats, charts, activity] = await Promise.all([
          api.admin.getStats(),
          api.admin.getChartData(),
          api.admin.getActivity()
        ]);
        setStatsData(stats);
        setChartData(charts);
        setActivities(activity);
      } catch (err) {
        console.error('Failed to fetch admin dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // We use the real totals for the top row, but fall back to mock data for the charts (until chart APIs are built)
  const totalRevenue = statsData?.totalRevenue || 0;
  const totalOrders  = statsData?.totalOrders || 0;
  const totalCustomers = statsData?.totalCustomers || 0;
  const totalProducts = statsData?.totalProducts || 0;
  const activeDeals = statsData?.activeDeals || 0;
  const recentOrders = statsData?.recentOrders || [];
  const categoryStats = statsData?.categoryStats || [];

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${(totalRevenue / 1000).toFixed(1)}k`,
      change: statsData?.revChange || 0,
      sparkData: statsData?.revenueSpark || REVENUE_SPARKLINE,
      sparkColor: '#2563eb',
      icon: <DollarSign className="w-5 h-5 text-blue-600" />,
      iconBg: '#eff6ff',
    },
    {
      title: 'Total Orders',
      value: totalOrders.toLocaleString(),
      change: statsData?.ordChange || 0,
      sparkData: statsData?.ordersSpark || ORDERS_SPARKLINE,
      sparkColor: '#10b981',
      icon: <ShoppingBag className="w-5 h-5 text-emerald-600" />,
      iconBg: '#ecfdf5',
    },
    {
      title: 'Live Deals',
      value: activeDeals.toLocaleString(),
      change: 0,
      sparkData: PRODUCTS_SPARKLINE,
      sparkColor: '#f43f5e',
      icon: <Star className="w-5 h-5 text-rose-500" />,
      iconBg: '#fff1f2',
    },
    {
      title: 'Total Subscribers',
      value: (statsData?.totalSubscribers || 0).toLocaleString(),
      change: 0,
      sparkData: CUSTOMERS_SPARKLINE,
      sparkColor: '#8b5cf6',
      icon: <Users className="w-5 h-5 text-violet-600" />,
      iconBg: '#f5f3ff',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Welcome back, Admin 👋</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Here's what's happening at LuxeMart today — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Bar Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-black text-slate-900">Revenue Overview</h2>
              <p className="text-xs text-slate-400 mt-0.5">Last 12 months performance</p>
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
          <BarChart 
            data={chartData.length > 0 ? chartData : MONTHLY_REVENUE} 
            activeMetric={metric} 
          />
        </div>

        {/* Category Donut */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="mb-5">
            <h2 className="text-sm font-black text-slate-900">Category Breakdown</h2>
            <p className="text-xs text-slate-400 mt-0.5">Revenue by category</p>
          </div>
          <DonutChart 
            data={categoryStats.length > 0 ? categoryStats : CATEGORY_STATS} 
            size={148} 
          />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-black text-slate-900">Recent Orders</h2>
              <p className="text-xs text-slate-400 mt-0.5">Latest 6 transactions</p>
            </div>
            <span 
              onClick={() => onNavigate?.('orders')}
              className="text-xs font-bold text-blue-600 cursor-pointer hover:underline"
            >
              View all →
            </span>
          </div>
          <div className="space-y-0">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-sm text-slate-400">No orders yet</div>
            ) : (
              recentOrders.map((order: any, idx: number) => {
                const s = STATUS_MAP[order.status] || STATUS_MAP.pending;
                return (
                  <div
                    key={order.id}
                    className={`flex items-center gap-3 py-3 ${idx !== recentOrders.length - 1 ? 'border-b border-slate-50' : ''}`}
                  >
                    <img
                      src={order.avatar}
                      alt={order.customer}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 truncate">{order.customer}</span>
                        <span className="text-[10px] font-mono text-slate-400">{order.id}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{order.product}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-black text-slate-900">${Number(order.amount).toFixed(2)}</div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.cls}`}>
                        {s.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="mb-4">
            <h2 className="text-sm font-black text-slate-900">Recent Activity</h2>
            <p className="text-xs text-slate-400 mt-0.5">Live store events</p>
          </div>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-sm text-slate-400">No recent activity</div>
            ) : (
              activities.map((act, idx) => (
                <div key={`${act.type}-${act.id}-${idx}`} className="flex items-start gap-3 relative">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: act.color + '18', color: act.color }}
                  >
                    {ACTIVITY_ICONS[act.type] ?? <Clock className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-700 font-medium leading-tight">{act.message}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{act.time}</p>
                  </div>
                  {idx < activities.length - 1 && (
                    <div
                      className="absolute left-[11px] w-px bg-slate-100 top-7 bottom-[-11px]"
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewView;
