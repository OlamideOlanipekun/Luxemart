import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import OverviewView from './views/OverviewView';
import OrdersView from './views/OrdersView';
import ProductsView from './views/ProductsView';
import CustomersView from './views/CustomersView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';
import AdminAuthPage from './AdminAuthPage';
import { api } from '../../services/api';
import CollectionsView from './views/CollectionsView';

export type AdminView = 'overview' | 'orders' | 'products' | 'collections' | 'customers' | 'analytics' | 'settings';

interface AdminDashboardProps {
  onExit: () => void;
  user: any;
  onAuthSuccess?: (userData: any) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit, user, onAuthSuccess }) => {
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  // Close mobile sidebar on view change
  const handleViewChange = (view: AdminView) => {
    setActiveView(view);
    setIsMobileSidebarOpen(false);
  };

  useEffect(() => {
    if (user && user.is_admin) {
      const fetchPendingCount = async () => {
        try {
          const orders = await api.admin.getOrders();
          const pending = orders.filter((o: any) => o.status === 'pending').length;
          setPendingOrdersCount(pending);
        } catch (err) {
          // Silent catch to prevent console flooding on 401
        }
      };
      fetchPendingCount();
      // Optionally set up a poll for "real-time"
      const interval = setInterval(fetchPendingCount, 60000); // every minute
      return () => clearInterval(interval);
    }
  }, [user]);

  // Show admin login page if not logged in or not admin
  if (!user || !user.is_admin) {
    return (
      <AdminAuthPage 
        onExit={onExit} 
        onAuthSuccess={onAuthSuccess || (() => {})} 
      />
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'overview':    return <OverviewView onNavigate={(view: string) => handleViewChange(view as AdminView)} />;
      case 'orders':      return <OrdersView />;
      case 'products':    return <ProductsView />;
      case 'collections': return <CollectionsView />;
      case 'customers':   return <CustomersView />;
      case 'analytics':   return <AnalyticsView />;
      case 'settings':    return <SettingsView user={user} onAuthSuccess={onAuthSuccess} />;
      default:            return <OverviewView onNavigate={(view: string) => handleViewChange(view as AdminView)} />;
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden relative"
      style={{ background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Sidebar */}
      <AdminSidebar
        activeView={activeView}
        onNavigate={handleViewChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(c => !c)}
        onExit={onExit}
        pendingOrdersCount={pendingOrdersCount}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <AdminHeader
          activeView={activeView}
          onExit={onExit}
          onMobileSidebarOpen={() => setIsMobileSidebarOpen(true)}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
