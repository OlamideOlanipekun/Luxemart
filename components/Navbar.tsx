
import { Search, User, Heart, ShoppingCart, Menu, ArrowRight, Tag, X } from 'lucide-react';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ALL_PRODUCTS, CATEGORIES } from '../constants';
import { supabase } from '../supabaseClient';

interface NavbarProps {
  currentView: 'home' | 'shop' | 'categories' | 'deals' | 'about' | 'auth' | 'wishlist' | 'cart' | 'product-detail';
  onNavigate: (view: any) => void;
  onCategorySelect?: (catId: string) => void;
  onProductSelect?: (productId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  wishlistCount: number;
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  onNavigate, 
  onCategorySelect,
  onProductSelect,
  searchQuery, 
  onSearchChange, 
  wishlistCount, 
  cartCount 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isCartAnimating, setIsCartAnimating] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (cartCount > 0) {
      setIsCartAnimating(true);
      const timer = setTimeout(() => setIsCartAnimating(false), 400);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return { products: [], categories: [] };
    const query = searchQuery.toLowerCase();

    const matchedProducts = ALL_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
    ).slice(0, 5);

    const matchedCategories = CATEGORIES.filter(c => 
      c.name.toLowerCase().includes(query)
    ).slice(0, 3);

    return { products: matchedProducts, categories: matchedCategories };
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (type: 'product' | 'category', value: string) => {
    if (type === 'category') {
      onCategorySelect?.(value);
      onSearchChange('');
    } else {
      onProductSelect?.(value);
      onSearchChange('');
    }
    setIsDropdownOpen(false);
    setIsMobileSearchOpen(false);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'categories', label: 'Categories' },
    { id: 'deals', label: 'Deals' },
    { id: 'about', label: 'About' }
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto px-1 flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group shrink-0"
            onClick={() => onNavigate('home')}
          >
            <div className="bg-blue-600 p-2 rounded-lg transition-all group-hover:scale-110 group-active:scale-95 shadow-lg shadow-blue-500/20">
              <ShoppingCart className="text-white w-5 h-5" fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">LuxeMart</span>
          </div>

          {/* Search - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8 relative" ref={dropdownRef}>
            <Search className="absolute left-3 text-gray-400 w-4 h-4 z-10" />
            <input
              type="text"
              placeholder="Search products, brands..."
              value={searchQuery}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setIsDropdownOpen(true);
              }}
              className="w-full bg-gray-50 border border-gray-100 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all focus:bg-white focus:shadow-sm"
            />

            {/* Suggestions Dropdown */}
            {isDropdownOpen && (searchQuery.trim().length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden animate-fadeInUp animate-duration-200">
                <div className="p-2">
                  {/* Categories Section */}
                  {suggestions.categories.length > 0 && (
                    <div className="mb-4">
                      <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Categories</div>
                      {suggestions.categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleSuggestionClick('category', cat.id)}
                          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 rounded-2xl transition-all group text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                              <Tag className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-slate-700">{cat.name}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Products Section */}
                  {suggestions.products.length > 0 ? (
                    <div>
                      <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Products</div>
                      {suggestions.products.map((prod) => (
                        <button
                          key={prod.id}
                          onClick={() => handleSuggestionClick('product', prod.id)}
                          className="w-full flex items-center gap-4 px-4 py-2.5 hover:bg-gray-50 rounded-2xl transition-all group text-left"
                        >
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                            <img src={prod.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-slate-900 truncate">{prod.name}</div>
                            <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">${prod.price.toFixed(2)}</div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    suggestions.categories.length === 0 && (
                      <div className="px-4 py-8 text-center">
                        <div className="text-sm font-bold text-gray-400 italic">No matches found for "{searchQuery}"</div>
                      </div>
                    )
                  )}
                </div>
                <button 
                  onClick={() => {
                    onNavigate('shop');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full bg-slate-900 py-3 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-colors"
                >
                  View all results for "{searchQuery}"
                </button>
              </div>
            )}
          </div>

          {/* Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button 
                key={link.id} 
                onClick={() => onNavigate(link.id as any)}
                className={`font-semibold text-sm transition-all relative py-1 ${
                  currentView === link.id 
                    ? 'text-blue-600 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:rounded-full' 
                    : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2 md:gap-5">
            {/* Search - Visible on mobile */}
            <button 
              onClick={() => setIsMobileSearchOpen(true)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors lg:hidden"
            >
              <Search className="w-5 h-5" />
            </button>
            
            {/* User - Hidden on mobile, moved to menu bar */}
            <button 
              onClick={() => onNavigate('auth')}
              className={`p-2 rounded-full transition-colors relative hidden md:block ${currentView === 'auth' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <User className={`w-5 h-5 ${isLoggedIn ? 'text-blue-600' : ''}`} />
              {isLoggedIn && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full border border-white shadow-sm"></div>
              )}
            </button>
            
            {/* Wishlist - Hidden on mobile, moved to menu bar */}
            <button 
              onClick={() => onNavigate('wishlist')}
              className={`p-2 relative rounded-full transition-colors hidden md:block ${currentView === 'wishlist' ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 && currentView !== 'wishlist' ? 'animate-pulse text-red-500' : ''}`} />
              {wishlistCount > 0 && (
                <div className="absolute top-1 right-1 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black border-2 border-white">
                  {wishlistCount}
                </div>
              )}
            </button>
            
            {/* Cart - Visible on mobile */}
            <button 
              onClick={() => onNavigate('cart')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all shadow-md active:scale-95 group ${
                currentView === 'cart' 
                ? 'bg-blue-700 text-white shadow-blue-500/40' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-semibold text-sm hidden sm:inline">Cart</span>
              <div className={`bg-white text-blue-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${isCartAnimating ? 'scale-150 bg-yellow-400' : 'scale-100'}`}>
                {cartCount}
              </div>
            </button>
            
            {/* Menu (Hamburger) - The menu bar entry */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation (The Menu Bar) */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 bg-black/60 backdrop-blur-sm ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 flex flex-col h-full overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <ShoppingCart className="text-white w-5 h-5" fill="currentColor" />
                </div>
                <span className="font-black text-xl italic tracking-tighter">LuxeMart</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-900" />
              </button>
            </div>

            {/* Account & Wishlist - Moved here for mobile */}
            <div className="space-y-2 mb-8 md:hidden">
              <div className="px-2 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Member Dashboard</div>
              <button
                onClick={() => { onNavigate('auth'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all ${
                  currentView === 'auth' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className={`w-5 h-5 ${isLoggedIn ? 'text-blue-600' : ''}`} />
                  <span className="font-black italic text-lg tracking-tight">My Profile</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-30" />
              </button>
              
              <button
                onClick={() => { onNavigate('wishlist'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all ${
                  currentView === 'wishlist' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-red-500 fill-current' : ''}`} />
                  <span className="font-black italic text-lg tracking-tight">Saved Items</span>
                </div>
                {wishlistCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full">
                    {wishlistCount}
                  </span>
                )}
                {!wishlistCount && <ArrowRight className="w-4 h-4 opacity-30" />}
              </button>
            </div>

            <div className="flex-1 space-y-1">
              <div className="px-2 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Curation Archive</div>
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-4 rounded-2xl text-lg font-black italic tracking-tight transition-all flex items-center justify-between ${
                    currentView === link.id ? 'bg-blue-50 text-blue-600' : 'text-slate-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                  <ArrowRight className={`w-4 h-4 transition-transform ${currentView === link.id ? 'translate-x-0' : '-translate-x-4 opacity-0'}`} />
                </button>
              ))}
            </div>

            <div className="pt-8 border-t border-gray-100 space-y-4">
              <button 
                onClick={() => { onNavigate('auth'); setIsMobileMenuOpen(false); }}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest italic text-sm shadow-xl"
              >
                {isLoggedIn ? 'Access Member Hub' : 'Member Access'}
              </button>
              <div className="flex justify-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span>Terms</span>
                <span className="w-1 h-1 bg-gray-200 rounded-full my-auto"></span>
                <span>Privacy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <div className={`fixed inset-0 z-[110] bg-white transition-all duration-300 ${isMobileSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-y-4'}`}>
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                autoFocus={isMobileSearchOpen}
                type="text"
                placeholder="Search Archive..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>
            <button onClick={() => setIsMobileSearchOpen(false)} className="p-4 font-black text-blue-600 uppercase text-xs tracking-widest">
              Cancel
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {searchQuery.trim().length > 0 ? (
              <div className="space-y-6">
                {suggestions.categories.length > 0 && (
                  <div>
                    <div className="px-2 mb-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Departments</div>
                    {suggestions.categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleSuggestionClick('category', cat.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-blue-50 rounded-2xl transition-all"
                      >
                        <span className="font-bold text-slate-900">{cat.name}</span>
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                      </button>
                    ))}
                  </div>
                )}
                
                {suggestions.products.length > 0 ? (
                  <div>
                    <div className="px-2 mb-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Drops</div>
                    {suggestions.products.map((prod) => (
                      <button
                        key={prod.id}
                        onClick={() => handleSuggestionClick('product', prod.id)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-blue-50 rounded-2xl transition-all text-left"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          <img src={prod.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-black text-slate-900 text-base italic truncate">{prod.name}</div>
                          <div className="text-xs font-black text-blue-600 uppercase tracking-widest">${prod.price.toFixed(2)}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  suggestions.categories.length === 0 && (
                    <div className="py-20 text-center">
                      <div className="text-gray-400 italic">No archival matches found.</div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="py-12 text-center space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Trending Searches</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {['Accessories', 'Tech', 'New Series', 'Limited'].map(term => (
                    <button 
                      key={term}
                      onClick={() => onSearchChange(term)}
                      className="px-6 py-3 bg-gray-50 rounded-xl font-bold text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all border border-gray-100"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
