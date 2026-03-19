import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Settings, LogOut, User, Menu } from 'lucide-react';
import { api } from '../../services/api';

import { AdminView } from './AdminDashboard';

interface AdminHeaderProps {
  activeView: AdminView;
  onExit: () => void;
  onMobileSidebarOpen?: () => void;
}

const VIEW_LABELS: Record<AdminView, { title: string; description: string }> = {
  overview:  { title: 'Dashboard',  description: 'Your store at a glance' },
  orders:    { title: 'Orders',     description: 'Manage customer orders' },
  products:  { title: 'Products',   description: 'Product catalog & inventory' },
  collections: { title: 'Collections', description: 'Manage homepage categories' },
  customers: { title: 'Customers',  description: 'Customer accounts & activity' },
  analytics: { title: 'Analytics',  description: 'Performance & revenue insights' },
  settings:  { title: 'Settings',   description: 'System parameters & security' },
};

const AdminHeader: React.FC<AdminHeaderProps> = ({ activeView, onExit, onMobileSidebarOpen }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const meta = VIEW_LABELS[activeView];

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.auth.me();
        setUser(data.user);
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 gap-4 flex-shrink-0 bg-white border-b border-slate-100"
      style={{ height: '72px' }}
    >
      {/* Mobile menu button + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileSidebarOpen}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-black text-slate-900 leading-tight">{meta.title}</h1>
          <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">{meta.description}</p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Quick search…"
            className="pl-8 pr-4 py-2 text-xs bg-slate-50 border border-slate-100 rounded-xl w-52 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors">
          <Bell className="w-4 h-4 text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 border border-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-100 mx-1" />

        {/* User */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(v => !v)}
            className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
          >
            <img
              src={user?.avatar || `https://i.pravatar.cc/32?u=${user?.email || 'admin'}`}
              alt="Admin"
              className="w-7 h-7 rounded-lg object-cover"
            />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-800 leading-tight">
                {user?.name || 'Admin'}
              </div>
              <div className="text-[10px] text-slate-400">Super Admin</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl border border-slate-100 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.12)] z-20 overflow-hidden py-1">
                <div className="px-3 py-2.5 border-b border-slate-50">
                  <div className="text-xs font-bold text-slate-800">{user?.name || 'Admin'}</div>
                  <div className="text-[10px] text-slate-400">{user?.email || 'admin@luxemart.com'}</div>
                </div>
                {[
                  { label: 'Profile', icon: <User className="w-3.5 h-3.5" /> },
                  { label: 'Settings', icon: <Settings className="w-3.5 h-3.5" /> },
                ].map(item => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
                <div className="border-t border-slate-50 mt-1">
                  <button
                    onClick={onExit}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Back to Store
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
