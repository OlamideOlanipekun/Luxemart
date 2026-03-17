import React, { useState, useMemo } from 'react';
import { Search, Mail, MoreVertical } from 'lucide-react';
import { api } from '../../../services/api';

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  vip:    { label: 'VIP',    cls: 'bg-purple-50 text-purple-600' },
  active: { label: 'Active', cls: 'bg-emerald-50 text-emerald-600' },
  new:    { label: 'New',    cls: 'bg-blue-50 text-blue-600' },
};

const FILTERS = ['All', 'VIP', 'Active', 'New'];

const CustomersView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await api.admin.getCustomers();
        setCustomers(data);
      } catch (err) {
        console.error('Failed to fetch admin customers', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = useMemo(() => {
    return customers.filter(c => {
      const matchFilter =
        activeFilter === 'All' || c.status === activeFilter.toLowerCase();
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [search, activeFilter, customers]);

  const totalRevenue = customers.reduce((s, c) => s + Number(c.spent), 0);
  const avgOrderValue = totalRevenue / (customers.reduce((s, c) => s + c.orders, 0) || 1);

  const counts: Record<string, number> = {
    All:    customers.length,
    VIP:    customers.filter(c => c.status === 'vip').length,
    Active: customers.filter(c => c.status === 'active').length,
    New:    customers.filter(c => c.status === 'new').length,
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
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Customers</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {customers.length} registered customers · Avg order value ${avgOrderValue.toFixed(2)}
          </p>
        </div>
        {/* Quick stats */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Total Customers', value: customers.length },
            { label: 'VIP Members',     value: counts['VIP'] },
            { label: 'New This Month',  value: counts['New'] },
          ].map(s => (
            <div key={s.label} className="bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-center">
              <div className="text-lg font-black text-slate-900">{s.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-slate-50">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
            />
          </div>
          <div className="flex gap-1.5">
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
                {['Customer', 'Email', 'Orders', 'Total Spent', 'Joined', 'Status', ''].map(h => (
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
                    No customers found
                  </td>
                </tr>
              ) : (
                filtered.map((customer, idx) => {
                  const s = STATUS_MAP[customer.status];
                  return (
                    <tr
                      key={customer.id}
                      className="hover:bg-slate-50/60 transition-colors"
                      style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f8fafc' : 'none' }}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={customer.avatar}
                            alt={customer.name}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                          <span className="text-xs font-bold text-slate-800">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {customer.email}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-bold text-slate-700">{customer.orders}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-black text-slate-900">
                          ${Number(customer.spent).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-slate-400">{customer.joined}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${s.cls}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 flex items-center justify-center transition-colors border border-slate-100">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-50">
          <span className="text-xs text-slate-400">
            Showing <span className="font-bold text-slate-600">{filtered.length}</span> of{' '}
            <span className="font-bold text-slate-600">{customers.length}</span> customers
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomersView;
