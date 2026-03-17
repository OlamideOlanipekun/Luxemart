import { ALL_PRODUCTS } from '../../constants';

export const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 42500, orders: 342 },
  { month: 'Feb', revenue: 38200, orders: 298 },
  { month: 'Mar', revenue: 51800, orders: 412 },
  { month: 'Apr', revenue: 47300, orders: 378 },
  { month: 'May', revenue: 62100, orders: 489 },
  { month: 'Jun', revenue: 58900, orders: 467 },
  { month: 'Jul', revenue: 71200, orders: 553 },
  { month: 'Aug', revenue: 68400, orders: 531 },
  { month: 'Sep', revenue: 79800, orders: 621 },
  { month: 'Oct', revenue: 85300, orders: 672 },
  { month: 'Nov', revenue: 92100, orders: 741 },
  { month: 'Dec', revenue: 103500, orders: 823 },
];

export const REVENUE_SPARKLINE = [42500, 38200, 51800, 47300, 62100, 58900, 71200, 68400, 79800, 85300, 92100, 103500];
export const ORDERS_SPARKLINE   = [342, 298, 412, 378, 489, 467, 553, 531, 621, 672, 741, 823];
export const CUSTOMERS_SPARKLINE = [120, 145, 162, 190, 215, 243, 278, 301, 334, 368, 401, 437];
export const PRODUCTS_SPARKLINE  = [12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17];

export const RECENT_ORDERS = [
  { id: 'LX-A9K2P', customer: 'Sarah Jenkins',   email: 'sarah@example.com',   avatar: 'https://i.pravatar.cc/40?u=sarah',   product: 'Classic Trench Coat',          amount: 129.00, status: 'delivered',  date: 'Mar 11, 2026', items: 1 },
  { id: 'LX-B3M7Q', customer: 'David Chen',       email: 'david@example.com',   avatar: 'https://i.pravatar.cc/40?u=david',   product: 'Smart Watch Series 5',         amount: 199.00, status: 'shipped',     date: 'Mar 11, 2026', items: 2 },
  { id: 'LX-C5N1R', customer: 'Elena Rodriguez',  email: 'elena@example.com',   avatar: 'https://i.pravatar.cc/40?u=elena',   product: 'Premium Leather Bag',          amount: 210.00, status: 'processing',  date: 'Mar 10, 2026', items: 1 },
  { id: 'LX-D8P4S', customer: 'Marcus White',     email: 'marcus@example.com',  avatar: 'https://i.pravatar.cc/40?u=marcus',  product: 'Smart NC Headphones',          amount: 279.00, status: 'pending',     date: 'Mar 10, 2026', items: 3 },
  { id: 'LX-E2R6T', customer: 'Aisha Patel',      email: 'aisha@example.com',   avatar: 'https://i.pravatar.cc/40?u=aisha',   product: 'Silk Evening Dress',           amount: 249.00, status: 'delivered',   date: 'Mar 09, 2026', items: 1 },
  { id: 'LX-F7U9V', customer: 'James Kim',        email: 'james@example.com',   avatar: 'https://i.pravatar.cc/40?u=james',   product: 'Mechanical Keyboard Pro',      amount: 129.00, status: 'shipped',     date: 'Mar 09, 2026', items: 2 },
  { id: 'LX-G1W3X', customer: 'Sophie Turner',    email: 'sophie@example.com',  avatar: 'https://i.pravatar.cc/40?u=sophie',  product: 'Aviator Sunglasses',           amount: 145.00, status: 'delivered',   date: 'Mar 08, 2026', items: 1 },
  { id: 'LX-H4Y6Z', customer: 'Omar Hassan',      email: 'omar@example.com',    avatar: 'https://i.pravatar.cc/40?u=omar',    product: 'Leather Weekend Bag',          amount: 380.00, status: 'processing',  date: 'Mar 08, 2026', items: 1 },
  { id: 'LX-I6A2B', customer: 'Priya Sharma',     email: 'priya@example.com',   avatar: 'https://i.pravatar.cc/40?u=priya',   product: 'Floral Maxi Dress',            amount: 69.00,  status: 'delivered',   date: 'Mar 07, 2026', items: 2 },
  { id: 'LX-J9C5D', customer: 'Luca Ferrari',     email: 'luca@example.com',    avatar: 'https://i.pravatar.cc/40?u=luca',    product: 'Designer Tote Bag',            amount: 499.00, status: 'pending',     date: 'Mar 07, 2026', items: 1 },
  { id: 'LX-K3E8F', customer: 'Yuki Tanaka',      email: 'yuki@example.com',    avatar: 'https://i.pravatar.cc/40?u=yuki',    product: 'Minimalist Watch',             amount: 149.00, status: 'shipped',     date: 'Mar 06, 2026', items: 1 },
  { id: 'LX-L7G1H', customer: 'Amara Diallo',     email: 'amara@example.com',   avatar: 'https://i.pravatar.cc/40?u=amara',   product: 'Cashmere Scarf',               amount: 89.00,  status: 'delivered',   date: 'Mar 06, 2026', items: 3 },
];

export const CUSTOMERS = [
  { id: 1, name: 'Aisha Patel',     email: 'aisha@example.com',   avatar: 'https://i.pravatar.cc/40?u=aisha',   orders: 21, spent: 6340.00, joined: 'Aug 18, 2024',  status: 'vip'    },
  { id: 2, name: 'Sophie Turner',   email: 'sophie@example.com',  avatar: 'https://i.pravatar.cc/40?u=sophie',  orders: 18, spent: 5120.25, joined: 'Sep 07, 2024',  status: 'vip'    },
  { id: 3, name: 'Elena Rodriguez', email: 'elena@example.com',   avatar: 'https://i.pravatar.cc/40?u=elena',   orders: 15, spent: 4210.75, joined: 'Nov 03, 2024',  status: 'active' },
  { id: 4, name: 'Sarah Jenkins',   email: 'sarah@example.com',   avatar: 'https://i.pravatar.cc/40?u=sarah',   orders: 12, spent: 2847.50, joined: 'Jan 15, 2025',  status: 'active' },
  { id: 5, name: 'Yuki Tanaka',     email: 'yuki@example.com',    avatar: 'https://i.pravatar.cc/40?u=yuki',    orders: 9,  spent: 2130.00, joined: 'Feb 10, 2025',  status: 'active' },
  { id: 6, name: 'David Chen',      email: 'david@example.com',   avatar: 'https://i.pravatar.cc/40?u=david',   orders: 8,  spent: 1923.00, joined: 'Feb 22, 2025',  status: 'active' },
  { id: 7, name: 'Luca Ferrari',    email: 'luca@example.com',    avatar: 'https://i.pravatar.cc/40?u=luca',    orders: 6,  spent: 1245.80, joined: 'Apr 01, 2025',  status: 'active' },
  { id: 8, name: 'James Kim',       email: 'james@example.com',   avatar: 'https://i.pravatar.cc/40?u=james',   orders: 5,  spent: 934.50,  joined: 'Dec 12, 2025',  status: 'active' },
  { id: 9, name: 'Amara Diallo',    email: 'amara@example.com',   avatar: 'https://i.pravatar.cc/40?u=amara',   orders: 4,  spent: 612.00,  joined: 'Jan 20, 2026',  status: 'active' },
  { id: 10, name: 'Priya Sharma',   email: 'priya@example.com',   avatar: 'https://i.pravatar.cc/40?u=priya',   orders: 4,  spent: 578.00,  joined: 'Feb 05, 2026',  status: 'active' },
  { id: 11, name: 'Marcus White',   email: 'marcus@example.com',  avatar: 'https://i.pravatar.cc/40?u=marcus',  orders: 3,  spent: 567.00,  joined: 'Mar 01, 2026',  status: 'new'    },
  { id: 12, name: 'Omar Hassan',    email: 'omar@example.com',    avatar: 'https://i.pravatar.cc/40?u=omar',    orders: 1,  spent: 380.00,  joined: 'Mar 08, 2026',  status: 'new'    },
];

export const CATEGORY_STATS = [
  { category: 'Women',      revenue: 89420, percentage: 32, color: '#ec4899' },
  { category: 'Tech',       revenue: 78350, percentage: 28, color: '#3b82f6' },
  { category: 'Accessories',revenue: 67890, percentage: 24, color: '#f59e0b' },
  { category: 'Men',        revenue: 44800, percentage: 16, color: '#10b981' },
];

export const WEEKLY_TRAFFIC = [
  { day: 'Mon', visitors: 1240 },
  { day: 'Tue', visitors: 1850 },
  { day: 'Wed', visitors: 1620 },
  { day: 'Thu', visitors: 2100 },
  { day: 'Fri', visitors: 2480 },
  { day: 'Sat', visitors: 3120 },
  { day: 'Sun', visitors: 2750 },
];

export const RECENT_ACTIVITY = [
  { id: 1, type: 'order',   message: 'New order #LX-A9K2P placed',        time: '2 min ago',  color: '#2563eb' },
  { id: 2, type: 'user',    message: 'Marcus White registered',            time: '15 min ago', color: '#10b981' },
  { id: 3, type: 'review',  message: 'New 5★ review on Leather Bag',       time: '32 min ago', color: '#f59e0b' },
  { id: 4, type: 'order',   message: 'Order #LX-H4Y6Z shipped',            time: '1 hr ago',   color: '#2563eb' },
  { id: 5, type: 'alert',   message: 'Sport Runner X low on stock (3 left)',time: '2 hr ago',   color: '#ef4444' },
  { id: 6, type: 'order',   message: 'Order #LX-G1W3X delivered',          time: '3 hr ago',   color: '#10b981' },
  { id: 7, type: 'review',  message: 'New 4★ review on Smart Watch',       time: '4 hr ago',   color: '#f59e0b' },
  { id: 8, type: 'user',    message: 'Omar Hassan registered',             time: '5 hr ago',   color: '#10b981' },
];

export const ADMIN_PRODUCTS = ALL_PRODUCTS.map(p => ({ ...p }));
