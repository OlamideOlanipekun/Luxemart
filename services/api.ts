/**
 * Centralized API client for LuxeMart frontend.
 * Handles JWT token management and request/response lifecycle.
 */

import { Category } from '../types';

const API_BASE = (import.meta as any).env.VITE_API_URL || ''; // Use empty for relative or full URL for production
 
/**
 * Resolves an image URL, prefixing it with the backend root if it is a relative path.
 */
export const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  const backendRoot = API_BASE.replace(/\/api$/, '');
  return `${backendRoot}${url.startsWith('/') ? '' : '/'}${url}`;
};

// ─── Token Management ───────────────────────────────────────────────

export const getToken = (): string | null => localStorage.getItem('luxemart_token');
export const setToken = (token: string) => localStorage.setItem('luxemart_token', token);
export const removeToken = () => localStorage.removeItem('luxemart_token');

// ─── Core Request Helper ────────────────────────────────────────────

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data as T;
}

// ─── Auth ───────────────────────────────────────────────────────────

export const api = {
  auth: {
    register: (name: string, email: string, password: string) =>
      request<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }),

    login: (email: string, password: string) =>
      request<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    me: () => request<{ user: any }>('/auth/me'),
    updateProfile: (data: any) =>
      request<{ message: string; user: any }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // ─── Products ───────────────────────────────────────────────────────

  products: {
    getAll: (params?: { category?: string; search?: string; sort?: string; badge?: string }) => {
      const query = new URLSearchParams();
      if (params?.category) query.set('category', params.category);
      if (params?.search) query.set('search', params.search);
      if (params?.sort) query.set('sort', params.sort);
      if (params?.badge) query.set('badge', params.badge);
      const qs = query.toString();
      return request<any[]>(`/products${qs ? '?' + qs : ''}`);
    },

    getOne: (id: string) => request<any>(`/products/${id}`),

    getCategories: () => request<any[]>('/products/categories/all'),
    getPublicSetting: (key: string) => request<any>(`/products/settings/${key}`),
  },

  // ─── Cart ─────────────────────────────────────────────────────────────

  cart: {
    get: () => request<any[]>('/cart'),

    add: (productId: string, quantity = 1) =>
      request('/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      }),

    update: (productId: string, quantity: number) =>
      request(`/cart/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      }),

    remove: (productId: string) =>
      request(`/cart/${productId}`, { method: 'DELETE' }),
  },

  // ─── Wishlist ─────────────────────────────────────────────────────────

  wishlist: {
    get: () => request<any[]>('/wishlist'),

    add: (productId: string) =>
      request(`/wishlist/${productId}`, { method: 'POST' }),

    remove: (productId: string) =>
      request(`/wishlist/${productId}`, { method: 'DELETE' }),
  },

  // ─── Orders ───────────────────────────────────────────────────────────

  orders: {
    create: () => request<{ orderNumber: string; total: number }>('/orders', { method: 'POST' }),

    getAll: () => request<any[]>('/orders'),

    getOne: (id: string) => request<any>(`/orders/${id}`),
  },

  // ─── Reviews ──────────────────────────────────────────────────────────

  reviews: {
    get: (productId: string) => request<any[]>(`/reviews/${productId}`),

    add: (productId: string, rating: number, comment: string) =>
      request(`/reviews/${productId}`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment }),
      }),
  },

  // ─── AI ───────────────────────────────────────────────────────────────

  ai: {
    styleAdvice: (query: string) =>
      request<{ response: string }>('/ai/style-advice', {
        method: 'POST',
        body: JSON.stringify({ query }),
      }),

    productInsight: (productName: string, category: string) =>
      request<{ response: string }>('/ai/product-insight', {
        method: 'POST',
        body: JSON.stringify({ productName, category }),
      }),

    reviewSummary: (productName: string, reviews: any[]) =>
      request<{ response: string }>('/ai/review-summary', {
        method: 'POST',
        body: JSON.stringify({ productName, reviews }),
      }),
  },

  // ─── Admin ────────────────────────────────────────────────────────────

  admin: {
    getStats: () => request<any>('/admin/stats'),
    getOrders: () => request<any[]>('/admin/orders'),
    getProducts: () => request<any[]>('/admin/products'),
    getCustomers: () => request<any[]>('/admin/customers'),
    getChartData: () => request<any[]>('/admin/chart-data'),
    getActivity: () => request<any[]>('/admin/activity'),
    getTrafficStats: () => request<any[]>('/admin/traffic-stats'),
    addProduct: (product: any) =>
      request<any>('/admin/products', { method: 'POST', body: JSON.stringify(product) }),
    updateProduct: (id: string, product: any) =>
      request<any>(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(product) }),
    deleteProduct: (id: string) =>
      request<any>(`/admin/products/${id}`, { method: 'DELETE' }),
    getAnalyticsMetrics: () => request<any>('/admin/analytics-metrics'),
    updateOrderStatus: (id: string, status: string) =>
      request<any>(`/admin/orders/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
    getSettings: (key: string) => request<any>(`/admin/settings/${key}`),
    updateSetting: (key: string, value: string) =>
      request<any>(`/admin/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value }) }),
    uploadImage: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      const token = getToken();
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to upload image');
      }
      return res.json() as Promise<{ url: string }>;
    },
  },

  // ─── Tracking ─────────────────────────────────────────────────────────

  tracking: {
    trackPageView: (data: { path: string; referrer?: string; session_id?: string }) =>
      request('/tracking/page-view', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // ─── Payments ────────────────────────────────────────────────────────
  payments: {
    createIntent: (amount: number, currency = 'usd') =>
      request<{ clientSecret: string }>('/payments/create-payment-intent', {
        method: 'POST',
        body: JSON.stringify({ amount, currency }),
      }),
  },

  // ─── Newsletter ─────────────────────────────────────────────────────

  newsletter: {
    subscribe: (email: string) =>
      request<{ message: string }>('/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
  },

  // ─── Categories ─────────────────────────────────────────────────────

  categories: {
    getAll: () => request<Category[]>('/categories'),
    update: (id: string, data: Partial<Category>) =>
      request<Category>(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
};

export default api;
