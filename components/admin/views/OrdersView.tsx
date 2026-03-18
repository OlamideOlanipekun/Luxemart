import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { api, getImageUrl } from '../../../services/api';

const STATUS_MAP: Record<string, { label: string; dot: string; cls: string }> = {
  delivered:  { label: 'Delivered',  dot: '#10b981', cls: 'bg-emerald-50 text-emerald-600' },
  shipped:    { label: 'Shipped',    dot: '#2563eb', cls: 'bg-blue-50 text-blue-600' },
  processing: { label: 'Processing', dot: '#f59e0b', cls: 'bg-amber-50 text-amber-600' },
  pending:    { label: 'Pending',    dot: '#94a3b8', cls: 'bg-slate-100 text-slate-500' },
};

const FILTERS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered'];

const OrdersView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const data = await api.admin.getOrders();
      setOrders(data);
    } catch (err) {
      // Silent catch to prevent 401 console flooding on expiry
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await api.admin.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error('Failed to update order status', err);
      alert('Failed to update order status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter(o => {
      const matchFilter =
        activeFilter === 'All' || o.status === activeFilter.toLowerCase();
      const matchSearch =
        !search ||
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.product.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [search, activeFilter, orders]);

  const counts: Record<string, number> = {
    All: orders.length,
    Pending:    orders.filter(o => o.status === 'pending').length,
    Processing: orders.filter(o => o.status === 'processing').length,
    Shipped:    orders.filter(o => o.status === 'shipped').length,
    Delivered:  orders.filter(o => o.status === 'delivered').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full pt-32">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Orders</h1>
        <p className="text-sm text-slate-400 mt-0.5">Manage and track all customer orders</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-slate-50">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
                  activeFilter === f
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                {f}
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    activeFilter === f ? 'bg-white/20' : 'bg-slate-200/60 text-slate-500'
                  }`}
                >
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50">
                {['Order ID', 'Customer', 'Product', 'Items', 'Amount', 'Status', 'Date'].map(h => (
                  <th
                    key={h}
                    className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-sm text-slate-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((order, idx) => {
                  const s = STATUS_MAP[order.status] || STATUS_MAP.pending;
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/60 transition-colors"
                      style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f8fafc' : 'none' }}
                    >
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs font-bold text-blue-600">{order.id}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={getImageUrl(order.avatar)}
                            alt={order.customer}
                            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-slate-800 text-xs">{order.customer}</div>
                            <div className="text-[10px] text-slate-400">{order.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-slate-600 font-medium">{order.product}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-slate-500">{order.items}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-black text-slate-900">${Number(order.amount).toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="relative inline-block">
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                            className={`appearance-none pl-7 pr-8 py-1.5 rounded-full text-[11px] font-bold border-none outline-none cursor-pointer transition-all ${s.cls} ${updatingId === order.id ? 'opacity-50' : ''}`}
                            style={{ backgroundImage: 'none' }}
                          >
                            {Object.entries(STATUS_MAP).map(([val, info]) => (
                               <option key={val} value={val}>{info.label}</option>
                            ))}
                          </select>
                          <span
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
                            style={{ backgroundColor: s.dot }}
                          />
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-current opacity-60 pointer-events-none" />
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-slate-400">{order.date}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Showing <span className="font-bold text-slate-600">{filtered.length}</span> of{' '}
            <span className="font-bold text-slate-600">{orders.length}</span> orders
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrdersView;
