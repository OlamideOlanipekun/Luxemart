
import React, { useState, useMemo, useEffect } from 'react';
import { Star, Heart, ShoppingBag, ChevronDown, LayoutGrid, Eye, Plus, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { Category } from '../types';
import { Product } from '../types';

interface ShopProps {
  products: Product[];
  categories: Category[];
  searchQuery: string;
  initialCategory?: string | null;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (id: string) => void;
  onProductClick: (id: string) => void;
}

const PRODUCTS_PER_PAGE = 6;

const Shop: React.FC<ShopProps> = ({ products, categories, searchQuery, initialCategory, wishlist, onToggleWishlist, onAddToCart, onProductClick }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(500);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [minRating, setMinRating] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    } else {
      setSelectedCategories([]);
    }
  }, [initialCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, priceRange, sortBy, minRating]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category_id);
      const matchesPrice = p.price <= priceRange;
      const matchesRating = p.rating >= minRating;
      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });

    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);

    return result;
  }, [searchQuery, selectedCategories, priceRange, minRating, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev => 
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-50 border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 font-black uppercase tracking-widest">
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Archive</span>
            <span>/</span>
            <span className="text-blue-600 font-medium italic">Shop Catalog</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic">Full <span className="text-blue-600">Collection</span></h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {/* Mobile filter toggle bar */}
        <div className="lg:hidden flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest italic">
            <span className="text-slate-900">{filteredProducts.length}</span> Items Found
          </span>
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
          >
            {isMobileFiltersOpen ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
            {isMobileFiltersOpen ? 'Close Filters' : 'Filters'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          <aside className={`w-full lg:w-72 shrink-0 space-y-12 lg:block ${isMobileFiltersOpen ? 'block' : 'hidden'}`}>
            <div>
                <h3 className="font-black text-xl text-slate-900 mb-6 border-b border-gray-100 pb-4 italic uppercase">
                  Categories
                </h3>
              <div className="space-y-4">
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-4 cursor-pointer group">
                    <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${
                      selectedCategories.includes(cat.id) ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/20' : 'border-gray-200 group-hover:border-blue-600'
                    }`}>
                      {selectedCategories.includes(cat.id) && <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      onChange={() => toggleCategory(cat.id)}
                      checked={selectedCategories.includes(cat.id)}
                    />
                    <span className={`text-base font-bold transition-colors ${
                      selectedCategories.includes(cat.id) ? 'text-blue-600 font-black' : 'text-gray-500'
                    }`}>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-black text-xl text-slate-900 mb-8 border-b border-gray-100 pb-4 italic uppercase">Price Limit</h3>
              <input 
                type="range" 
                min="0" 
                max="500" 
                step="10"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between mt-4 text-base font-black text-blue-600 italic">
                <span>$0</span>
                <span className="bg-blue-50 px-3 py-1 rounded-lg shadow-sm">${priceRange}</span>
              </div>
            </div>

            <div>
              <h3 className="font-black text-xl text-slate-900 mb-8 border-b border-gray-100 pb-4 italic uppercase">Member Rating</h3>
              <div className="space-y-4">
                {[4, 3, 2].map(rating => (
                  <button 
                    key={rating}
                    onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                    className={`flex items-center gap-3 w-full text-sm font-black p-4 rounded-2xl transition-all uppercase tracking-widest ${
                      minRating === rating ? 'bg-slate-900 text-white shadow-2xl' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`flex ${minRating === rating ? 'text-blue-400' : 'text-yellow-400'}`}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span>& Up</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 pb-8 border-b border-gray-100">
              <div className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">
                Curation <span className="text-slate-900 font-black italic">{filteredProducts.length} Items Found</span>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-white border-2 border-gray-100 rounded-2xl px-6 py-3 pr-12 text-[10px] font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 w-full cursor-pointer transition-all hover:border-blue-600"
                  >
                    <option value="featured">Featured First</option>
                    <option value="price-low">Value: Low to High</option>
                    <option value="price-high">Value: High to Low</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {currentProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                  {currentProducts.map((product) => (
                    <div key={product.id} className="group flex flex-col animate-fadeInUp cursor-pointer">
                      <div 
                        className="relative aspect-[3/4] overflow-hidden rounded-[3rem] bg-gray-100 mb-8 shadow-md transition-all duration-700 group-hover:shadow-3xl group-hover:-translate-y-2"
                        onClick={() => onProductClick(product.id)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        {product.badge && (
                          <div className={`absolute top-6 left-6 px-4 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-2xl ${
                            product.badge === 'SALE' ? 'bg-red-500' : 'bg-blue-600'
                          }`}>
                            {product.badge}
                          </div>
                        )}
                        
                        <div className="absolute top-6 right-6 flex flex-col gap-3 translate-x-16 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                          <button 
                            onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
                            className={`p-4 bg-white/95 backdrop-blur-xl rounded-full shadow-2xl transition-all active:scale-90 ${
                              wishlist.includes(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                          </button>
                          <button 
                            className="p-4 bg-white/95 backdrop-blur-xl rounded-full shadow-2xl text-gray-400 hover:text-blue-600 transition-all active:scale-90"
                            onClick={(e) => { e.stopPropagation(); onProductClick(product.id); }}
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="absolute bottom-6 left-6 right-6 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                          <button 
                            onClick={(e) => { e.stopPropagation(); onAddToCart(product.id); }}
                            className="w-full bg-slate-900/95 backdrop-blur-xl text-white py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-blue-600 hover:scale-[1.02] transition-all shadow-3xl active:scale-95 border border-white/10 uppercase tracking-widest text-xs"
                          >
                            <Plus className="w-4 h-4" />
                            Quick Add
                            <ShoppingBag className="w-4 h-4 ml-1" />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 space-y-4 px-3" onClick={() => onProductClick(product.id)}>
                        <h3 className="font-black text-2xl text-slate-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-1 italic tracking-tight">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center text-yellow-400 bg-yellow-400/5 px-2.5 py-1 rounded-xl">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="ml-1.5 text-xs font-black text-slate-900">{product.rating}</span>
                          </div>
                          <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">({product.reviews_count})</span>
                        </div>
                        <div className="flex items-baseline gap-3 pt-1">
                          <span className="text-3xl font-black text-blue-600 tracking-tighter italic">${product.price.toFixed(2)}</span>
                          {product.original_price && (
                            <span className="text-base text-gray-300 line-through font-bold">${product.original_price.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-32 flex justify-center items-center gap-6">
                    <button
                      onClick={() => goToPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-5 rounded-[2rem] border-2 border-gray-100 text-slate-900 hover:border-blue-600 hover:text-blue-600 transition-all disabled:opacity-20 shadow-sm"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    
                    <div className="flex gap-4">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => goToPage(i + 1)}
                          className={`w-14 h-14 rounded-[1.5rem] font-black text-lg transition-all ${
                            currentPage === i + 1
                              ? 'bg-slate-900 text-white shadow-3xl transform -translate-y-1'
                              : 'bg-white border-2 border-gray-100 text-slate-400 hover:border-blue-600 hover:text-blue-600 shadow-sm'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-5 rounded-[2rem] border-2 border-gray-100 text-slate-900 hover:border-blue-600 hover:text-blue-600 transition-all disabled:opacity-20 shadow-sm"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-40 bg-gray-50 rounded-[5rem] border-4 border-dashed border-gray-100">
                <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 shadow-3xl">
                  <LayoutGrid className="w-10 h-10 text-gray-200" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-6 italic uppercase tracking-tighter">Curation Empty</h3>
                <p className="text-gray-500 text-xl max-w-sm mx-auto font-medium">Try widening your price limit or exploring different collection departments.</p>
                <button 
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange(500);
                    setMinRating(0);
                  }}
                  className="mt-12 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg hover:bg-blue-600 transition-all shadow-3xl uppercase tracking-widest italic"
                >
                  Clear System Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
