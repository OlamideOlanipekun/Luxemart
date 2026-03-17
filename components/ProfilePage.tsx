import React, { useState, useEffect } from 'react';
import { User, Package, Clock, ChevronRight, LogOut, Mail, Calendar, ShoppingBag } from 'lucide-react';
import { api } from '../services/api';

interface ProfilePageProps {
  user: any;
  onLogout: () => void;
  onNavigate: (view: any) => void;
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending:    { label: 'Pending',    cls: 'bg-slate-100 text-slate-500' },
  processing: { label: 'Processing', cls: 'bg-amber-50 text-amber-600' },
  shipped:    { label: 'Shipped',    cls: 'bg-blue-50 text-blue-600' },
  delivered:  { label: 'Delivered',  cls: 'bg-emerald-50 text-emerald-600' },
};

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout, onNavigate }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      api.orders.getAll()
        .then(data => setOrders(data))
        .catch(() => {})
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
            <User className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Sign In Required</h1>
          <p className="text-sm text-slate-500 mb-6">Log in to view your profile and order history.</p>
          <button
            onClick={() => onNavigate('auth')}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const joinDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/20">
              {user.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-black text-slate-900">{user.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-1.5">
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {joinDate}
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 text-center">
            <div className="text-2xl font-black text-slate-900">{orders.length}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Total Orders</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 text-center">
            <div className="text-2xl font-black text-slate-900">
              ${orders.reduce((s, o) => s + Number(o.total || 0), 0).toFixed(2)}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Total Spent</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 text-center">
            <div className="text-2xl font-black text-slate-900">
              {orders.filter(o => o.status === 'delivered').length}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Delivered</div>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-black text-slate-900">Order History</h2>
            </div>
            <p className="text-sm text-slate-400 mt-0.5">Your recent purchases and order status</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 px-4">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-black text-slate-900 mb-1">No Orders Yet</h3>
              <p className="text-sm text-slate-500 mb-5">Your order history will appear here once you make a purchase.</p>
              <button
                onClick={() => onNavigate('shop')}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {orders.map(order => {
                const s = STATUS_MAP[order.status] || STATUS_MAP.pending;
                const isExpanded = expandedOrder === String(order.id);
                const orderDate = order.created_at
                  ? new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '';

                return (
                  <div key={order.id}>
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : String(order.id))}
                      className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-900">
                              {order.order_number || `Order #${order.id}`}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.cls}`}>
                              {s.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {orderDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-slate-900">
                          ${Number(order.total || 0).toFixed(2)}
                        </span>
                        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </button>

                    {/* Expanded Order Details */}
                    {isExpanded && order.items && (
                      <div className="px-5 pb-5 bg-slate-50/50">
                        <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between px-4 py-3">
                              <div>
                                <div className="text-xs font-bold text-slate-800">
                                  {item.product_name || item.name || `Product #${item.product_id}`}
                                </div>
                                <div className="text-[10px] text-slate-400">Qty: {item.quantity}</div>
                              </div>
                              <div className="text-xs font-black text-slate-900">
                                ${(Number(item.price) * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mt-3 px-1">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Subtotal: ${Number(order.subtotal || 0).toFixed(2)} · 
                            Tax: ${Number(order.tax || 0).toFixed(2)} · 
                            Shipping: ${Number(order.shipping || 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
