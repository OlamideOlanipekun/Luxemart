import React from 'react';
import {
  LayoutDashboard, ShoppingBag, Package, Users,
  BarChart2, Settings, ArrowLeft, ChevronLeft, ChevronRight,
  Sparkles,
} from 'lucide-react';

import { AdminView } from './AdminDashboard';

interface NavItem {
  id: AdminView;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface AdminSidebarProps {
  activeView: AdminView;
  onNavigate: (view: AdminView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onExit: () => void;
  pendingOrdersCount?: number;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const getNavItems = (pendingCount: number = 0): NavItem[] => [
  { id: 'overview',   label: 'Overview',   icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
  { id: 'orders',     label: 'Orders',     icon: <ShoppingBag className="w-[18px] h-[18px]" />, badge: pendingCount > 0 ? pendingCount : undefined },
  { id: 'products',   label: 'Products',   icon: <Package className="w-[18px] h-[18px]" /> },
  { id: 'collections', label: 'Collections', icon: <Sparkles className="w-[18px] h-[18px]" /> },
  { id: 'customers',  label: 'Customers',  icon: <Users className="w-[18px] h-[18px]" /> },
  { id: 'analytics',  label: 'Analytics',  icon: <BarChart2 className="w-[18px] h-[18px]" /> },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeView,
  onNavigate,
  collapsed,
  onToggleCollapse,
  onExit,
  pendingOrdersCount = 0,
  isMobileOpen = false,
  onMobileClose,
}) => {
  const navItems = getNavItems(pendingOrdersCount);

  const handleNavigate = (view: AdminView) => {
    onNavigate(view);
    onMobileClose?.();
  };

  const handleExit = () => {
    onExit();
    onMobileClose?.();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`
          h-screen flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out relative z-50
          fixed lg:static
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          width: collapsed ? '72px' : '240px',
          background: '#0f172a',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5 border-b overflow-hidden min-h-[64px] lg:min-h-[72px]"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-white font-black text-sm leading-tight whitespace-nowrap">LuxeMart</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-blue-400 whitespace-nowrap">
              Admin Panel
            </div>
          </div>
        )}
      </div>

      {/* Collapse Toggle - Hidden on Mobile */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-slate-700 border border-slate-600 hidden lg:flex items-center justify-center hover:bg-slate-600 transition-colors z-10"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3 text-slate-300" />
          : <ChevronLeft className="w-3 h-3 text-slate-300" />
        }
      </button>

      {/* Section label */}
      {!collapsed && (
        <div className="px-4 pt-5 pb-2">
          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-600">
            Main Menu
          </span>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-2 space-y-0.5 mt-2 overflow-y-auto">
        {navItems.map(item => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative"
              style={{
                background: isActive ? 'rgba(37,99,235,0.15)' : 'transparent',
              }}
              title={collapsed ? item.label : undefined}
            >
              {/* Active indicator */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-blue-500"
                />
              )}

              <span
                style={{
                  color: isActive ? '#60a5fa' : '#94a3b8',
                  transition: 'color 0.15s',
                }}
                className="flex-shrink-0 group-hover:!text-white"
              >
                {item.icon}
              </span>

              {!collapsed && (
                <>
                  <span
                    className="text-sm font-semibold flex-1 text-left whitespace-nowrap transition-colors group-hover:text-white"
                    style={{ color: isActive ? '#e2e8f0' : '#94a3b8' }}
                  >
                    {item.label}
                  </span>
                  {item.badge !== undefined && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">
                      {item.badge}
                    </span>
                  )}
                </>
              )}

              {/* Collapsed badge dot */}
              {collapsed && item.badge !== undefined && (
                <span
                  className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-500"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div
        className="px-2 pb-4 pt-3 border-t space-y-0.5"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <button
          onClick={() => handleNavigate('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
            activeView === 'settings' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
          }`}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span className="text-sm font-semibold whitespace-nowrap">Settings</span>}
        </button>
        <button
          onClick={handleExit}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all group"
          title={collapsed ? 'Back to Store' : undefined}
        >
          <ArrowLeft className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span className="text-sm font-semibold whitespace-nowrap">Back to Store</span>}
        </button>
      </div>
    </aside>
    </>
  );
};

export default AdminSidebar;
