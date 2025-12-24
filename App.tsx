
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import BestSellers from './components/BestSellers';
import SaleBanner from './components/SaleBanner';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import Assistant from './components/Assistant';
import BackToTop from './components/BackToTop';
import Shop from './components/Shop';
import CategoriesPage from './components/CategoriesPage';
import DealsPage from './components/DealsPage';
import AboutPage from './components/AboutPage';
import AuthPage from './components/AuthPage';
import WishlistPage from './components/WishlistPage';
import CartPage from './components/CartPage';
import ProductDetail from './components/ProductDetail';
import FeaturesBar from './components/FeaturesBar';
import EditorialSection from './components/EditorialSection';
import Philosophy from './components/Philosophy';
import SocialFeed from './components/SocialFeed';
import Preloader from './components/Preloader';
import OrderSuccess from './components/OrderSuccess';
import { ContactPage, ShippingPage, SizeGuidePage, LegalPage } from './components/FooterPages';
import { ALL_PRODUCTS } from './constants';
import { CartItem, Product } from './types';
import { CheckCircle2, X } from 'lucide-react';
import { supabase } from './supabaseClient';

type AppView = 'home' | 'shop' | 'categories' | 'deals' | 'about' | 'auth' | 'wishlist' | 'cart' | 'product-detail' | 'contact' | 'shipping' | 'size-guide' | 'privacy' | 'terms' | 'order-success';

const App: React.FC = () => {
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [view, setView] = useState<AppView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ show: boolean, product: Product | null }>({ show: false, product: null });
  const [lastOrderNumber, setLastOrderNumber] = useState('');
  const [user, setUser] = useState<any>(null);
  
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('luxemart_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('luxemart_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Supabase Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('luxemart_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('luxemart_cart', JSON.stringify(cart));
  }, [cart]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const handleAddToCart = (productId: string) => {
    const product = ALL_PRODUCTS.find(p => p.id === productId);
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
    
    if (product) {
      setNotification({ show: true, product });
      setTimeout(() => setNotification({ show: false, product: null }), 3000);
    }
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    ));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const navigateTo = (newView: AppView) => {
    setView(newView);
    if (newView !== 'shop' && newView !== 'product-detail') {
      setActiveCategoryFilter(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    setView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('home');
  };

  useEffect(() => {
    (window as any).handleProductSelect = handleProductSelect;
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategoryFilter(categoryId);
    setSearchQuery('');
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = () => {
    const orderNum = `LX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setLastOrderNumber(orderNum);
    setCart([]);
    setView('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {isLoadingApp && <Preloader onComplete={() => setIsLoadingApp(false)} />}
      
      <Navbar 
        currentView={view as any} 
        onNavigate={navigateTo} 
        onCategorySelect={handleCategorySelect}
        onProductSelect={handleProductSelect}
        searchQuery={searchQuery}
        wishlistCount={wishlist.length}
        cartCount={cartCount}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (view !== 'shop' && view !== 'product-detail' && q.length > 0) setView('shop');
        }}
      />
      
      <div className={`fixed top-24 right-4 md:right-8 z-[100] transition-all duration-500 transform ${
        notification.show ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0 pointer-events-none'
      }`}>
        {notification.product && (
          <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 p-4 flex items-center gap-4 max-w-xs md:max-w-sm">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl overflow-hidden shrink-0">
              <img src={notification.product.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Added to Cart</span>
              </div>
              <div className="text-sm font-black text-slate-900 line-clamp-1">{notification.product.name}</div>
            </div>
            <button 
              onClick={() => setNotification({ show: false, product: null })}
              className="text-gray-300 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <main className="flex-grow">
        {view === 'home' && (
          <>
            <Hero onShopNow={() => navigateTo('shop')} onViewCollections={() => navigateTo('categories')} />
            <FeaturesBar />
            <Categories 
              onCategoryClick={handleCategorySelect} 
              onViewAll={() => navigateTo('categories')} 
            />
            <EditorialSection onExplore={() => navigateTo('shop')} />
            <BestSellers 
              wishlist={wishlist} 
              onToggleWishlist={toggleWishlist} 
              onAddToCart={handleAddToCart}
              onProductClick={handleProductSelect}
            />
            <Philosophy />
            <SaleBanner onShopSale={() => navigateTo('deals')} />
            <SocialFeed onJoin={() => navigateTo('auth')} />
            <Testimonials />
            <Newsletter onPrivacyClick={() => navigateTo('privacy')} />
          </>
        )}
        
        {view === 'shop' && (
          <Shop 
            searchQuery={searchQuery} 
            initialCategory={activeCategoryFilter} 
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onAddToCart={handleAddToCart}
            onProductClick={handleProductSelect}
          />
        )}

        {view === 'categories' && (
          <CategoriesPage onCategorySelect={handleCategorySelect} />
        )}

        {view === 'deals' && (
          <DealsPage 
            wishlist={wishlist} 
            onToggleWishlist={toggleWishlist} 
            onAddToCart={handleAddToCart}
            onProductClick={handleProductSelect}
          />
        )}

        {view === 'product-detail' && selectedProductId && (
          <ProductDetail 
            productId={selectedProductId}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onAddToCart={handleAddToCart}
            onBack={() => navigateTo('shop')}
          />
        )}

        {view === 'about' && <AboutPage onNavigate={navigateTo} />}
        {view === 'auth' && (
          <AuthPage 
            onAuthSuccess={() => navigateTo('home')} 
            onLogout={handleLogout}
            currentUser={user}
          />
        )}
        {view === 'wishlist' && (
          <WishlistPage 
            wishlist={wishlist} 
            onToggleWishlist={toggleWishlist} 
            onAddToCart={handleAddToCart}
            onShopNow={() => navigateTo('shop')}
            onGoToCart={() => navigateTo('cart')}
          />
        )}
        {view === 'cart' && (
          <CartPage 
            cart={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemove={handleRemoveFromCart}
            onShopNow={() => navigateTo('shop')}
            onCheckout={handleCheckout}
            onAddToCart={handleAddToCart}
          />
        )}

        {view === 'order-success' && (
          <OrderSuccess 
            orderNumber={lastOrderNumber} 
            onContinue={() => navigateTo('home')} 
          />
        )}

        {view === 'contact' && <ContactPage />}
        {view === 'shipping' && <ShippingPage />}
        {view === 'size-guide' && <SizeGuidePage />}
        {view === 'privacy' && <LegalPage type="privacy" />}
        {view === 'terms' && <LegalPage type="terms" />}
      </main>
      
      <Footer onNavigate={navigateTo} />
      <BackToTop />
      <Assistant />
    </div>
  );
};

export default App;
