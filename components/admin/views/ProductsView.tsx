import React, { useState, useMemo, useRef } from 'react';
import { Search, Star, Edit2, Trash2, X, Upload } from 'lucide-react';
import { api, getImageUrl } from '../../../services/api';

type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

const getStockStatus = (count: number | undefined): StockStatus => {
  if (!count || count === 0) return 'Out of Stock';
  if (count <= 5) return 'Low Stock';
  return 'In Stock';
};

const STOCK_MAP: Record<StockStatus, string> = {
  'In Stock':    'bg-emerald-50 text-emerald-600',
  'Low Stock':   'bg-amber-50 text-amber-600',
  'Out of Stock':'bg-red-50 text-red-500',
};

const BADGE_MAP: Record<string, string> = {
  SALE: 'bg-rose-50 text-rose-500',
  NEW:  'bg-blue-50 text-blue-600',
};

const CATEGORIES = ['All', 'men', 'women', 'accessories', 'tech'];

const EMPTY_FORM = {
  name: '', category_id: 'men', price: '', original_price: '', image: '', badge: '', stock_count: '0', is_featured: false,
};

const ProductsView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showOnlySale, setShowOnlySale] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.admin.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch admin products', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchCat = activeCategory === 'All' || p.category_id === activeCategory;
      const matchSale = !showOnlySale || (p.badge === 'SALE' || (p.original_price && p.original_price > p.price));
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.category_id || '').toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSale && matchSearch;
    });
  }, [search, activeCategory, showOnlySale, products]);

  const totalValue = products.reduce((s, p) => s + p.price * (p.stock_count ?? 0), 0);

  // Open modal for add / edit
  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (product: any) => {
    setEditingId(product.id);
    setForm({
      name: product.name || '',
      category_id: product.category_id || 'men',
      price: String(product.price ?? ''),
      original_price: product.original_price ? String(product.original_price) : '',
      image: product.image || '',
      badge: product.badge || '',
      stock_count: String(product.stock_count ?? 0),
      is_featured: !!product.is_featured,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.category_id || !form.price) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        category_id: form.category_id,
        price: Number(form.price),
        original_price: form.original_price ? Number(form.original_price) : null,
        image: form.image || null,
        badge: form.badge || null,
        stock_count: Number(form.stock_count) || 0,
        is_featured: form.is_featured ? 1 : 0,
      };
      if (editingId) {
        await api.admin.updateProduct(editingId, payload);
      } else {
        await api.admin.addProduct(payload);
      }
      setShowModal(false);
      await fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.admin.deleteProduct(id);
      setDeleteConfirm(null);
      await fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { url } = await api.admin.uploadImage(file);
      setForm(prev => ({ ...prev, image: url }));
    } catch (err: any) {
      alert(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Products</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {products.length} products · Inventory value ${totalValue.toLocaleString()}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-slate-50">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all duration-150 ${
                  activeCategory === c
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                {c}
              </button>
            ))}
            <div className="w-px h-4 bg-slate-200 mx-1 hidden sm:block"></div>
            <button
              onClick={() => setShowOnlySale(!showOnlySale)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                showOnlySale
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-200'
                  : 'bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-500 border border-slate-100'
              }`}
            >
              Sale Only
            </button>
          </div>
        </div>

        {/* Table - Hidden on Mobile */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50">
                {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Status', ''].map(h => (
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
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map((product, idx) => {
                  const stockStatus = getStockStatus(product.stock_count);
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50/60 transition-colors"
                      style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f8fafc' : 'none' }}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-slate-800 text-xs leading-tight">{product.name}</div>
                              {product.is_featured === 1 && (
                                <span className="flex items-center gap-1 text-[8px] font-black text-amber-500 uppercase tracking-tighter bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">ID: {product.id}</div>
                          </div>
                          {product.badge && (
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ml-1 ${BADGE_MAP[product.badge]}`}>
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs capitalize text-slate-500 font-medium">{product.category_id}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div>
                          <div className="text-xs font-black text-slate-900">${Number(product.price).toFixed(2)}</div>
                          {product.original_price && (
                            <div className="text-[10px] text-slate-400 line-through">
                              ${Number(product.original_price).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-slate-600 font-semibold">
                          {product.stock_count ?? 0}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-bold text-slate-700">{product.rating}</span>
                          <span className="text-[10px] text-slate-400">({product.reviews_count})</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${STOCK_MAP[stockStatus]}`}>
                          {stockStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEdit(product)}
                            className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-500 flex items-center justify-center transition-colors border border-slate-100"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors border border-slate-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List - Shown only on Mobile */}
        <div className="block sm:hidden divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-400">No products found</div>
          ) : (
            filtered.map((product) => {
              const stockStatus = getStockStatus(product.stock_count);
              return (
                <div key={product.id} className="p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                      <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">{product.name}</h3>
                        {product.badge && (
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${BADGE_MAP[product.badge]}`}>
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                        <span>{product.category_id}</span>
                        <span>ID: {product.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Price</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-black text-slate-900">${Number(product.price).toFixed(2)}</span>
                        {product.original_price && (
                          <span className="text-[10px] text-slate-400 line-through">${Number(product.original_price).toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Stock</div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-700">{product.stock_count}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${STOCK_MAP[stockStatus]}`}>
                          {stockStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-slate-700">{product.rating}</span>
                      <span className="text-[10px] text-slate-400">({product.reviews_count})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 font-bold text-[10px] uppercase tracking-widest border border-slate-100"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="p-1.5 rounded-xl bg-slate-50 text-red-500 border border-slate-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-4 py-3 border-t border-slate-50">
          <span className="text-xs text-slate-400">
            Showing <span className="font-bold text-slate-600">{filtered.length}</span> of{' '}
            <span className="font-bold text-slate-600">{products.length}</span> products
          </span>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 relative animate-in">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-black text-slate-900 mb-5">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Product Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                  placeholder="e.g. Classic Leather Jacket"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Category *</label>
                  <select
                    value={form.category_id}
                    onChange={e => setForm({ ...form, category_id: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="accessories">Accessories</option>
                    <option value="tech">Tech</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Badge</label>
                  <select
                    value={form.badge}
                    onChange={e => setForm({ ...form, badge: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">None</option>
                    <option value="NEW">NEW</option>
                    <option value="SALE">SALE</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Original Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.original_price}
                    onChange={e => setForm({ ...form, original_price: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Stock</label>
                  <input
                    type="number"
                    value={form.stock_count}
                    onChange={e => setForm({ ...form, stock_count: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, is_featured: !form.is_featured })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                    form.is_featured 
                      ? 'bg-amber-50 border-amber-200 text-amber-600' 
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <Star className={`w-4 h-4 ${form.is_featured ? 'fill-current' : ''}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Feature on Homepage</span>
                </button>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Image URL / Upload</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.image}
                    onChange={e => setForm({ ...form, image: e.target.value })}
                    className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="https://..."
                  />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload}
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-4 py-2 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
                    title="Upload Local File"
                  >
                    {uploadingImage ? (
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.name || !form.price}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">Delete Product?</h3>
            <p className="text-sm text-slate-500 mb-5">This action cannot be undone. The product will be removed from all carts and wishlists.</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-5 py-2 text-xs font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsView;
