
import React, { useState, useEffect, useRef } from 'react';
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
import AdminDashboard from './components/admin/AdminDashboard';
import ProfilePage from './components/ProfilePage';
import CheckoutPage from './components/CheckoutPage';
import { CATEGORIES } from './constants';
import { CartItem, Product, Category } from './types';
import { CheckCircle2, X } from 'lucide-react';
import { api, getToken, removeToken, getImageUrl } from './services/api';
import { trackPageView } from './services/tracking';

type AppView = 'home' | 'shop' | 'categories' | 'deals' | 'about' | 'auth' | 'wishlist' | 'cart' | 'product-detail' | 'contact' | 'shipping' | 'size-guide' | 'privacy' | 'terms' | 'order-success' | 'admin' | 'profile' | 'checkout';

const App: React.FC = () => {
  // ─── Routing & State ────────────────────────────────────────────────
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  
  // Parse initial view from URL
  const getInitialView = (): { view: AppView; productId: string | null } => {
    const path = window.location.pathname;
    if (path === '/' || path === '/home') return { view: 'home', productId: null };
    if (path.startsWith('/product/')) {
      return { view: 'product-detail', productId: path.split('/').pop() || null };
    }
    const derivedView = path.slice(1) as AppView;
    const validViews: AppView[] = ['home', 'shop', 'categories', 'deals', 'about', 'auth', 'wishlist', 'cart', 'product-detail', 'contact', 'shipping', 'size-guide', 'privacy', 'terms', 'order-success', 'admin', 'profile', 'checkout'];
    return validViews.includes(derivedView) ? { view: derivedView, productId: null } : { view: 'home', productId: null };
  };

  const initialRoute = getInitialView();
  const [view, setView] = useState<AppView>(initialRoute.view);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(initialRoute.productId);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ show: boolean, product: Product | null }>({ show: false, product: null });
  const [lastOrderNumber, setLastOrderNumber] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('luxemart_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('luxemart_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch initial data
  useEffect(() => {
    const init = async () => {
      try {
        const token = getToken();
        if (token) {
          try {
            const data = await api.auth.me();
            setUser(data.user);
          } catch (authErr) {
            console.error("Auth validation failed, clearing token:", authErr);
            removeToken();
          }
        }
      } catch (err) {
        console.error("Token read error:", err);
      }
      
      try {
        const [productsData, catsData] = await Promise.all([
          api.products.getAll().catch(e => { console.error("Products error", e); return []; }),
          api.categories.getAll().catch(e => { console.error("Categories error", e); return []; })
        ]);

        console.log("Fetched products success:", productsData?.length);
        setProducts(productsData || []);
        setCategories(catsData || []);
      } catch (err) {
        console.error("Initialization error - FULL DETAIL:", err);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    init();
  }, []);

  // Sync cart/wishlist from server when user logs in
  const hasSyncedRef = useRef(false);
  useEffect(() => {
    if (user && !hasSyncedRef.current) {
      hasSyncedRef.current = true;
      const syncData = async () => {
        try {
          const hasSynced = sessionStorage.getItem('luxemart_synced') === 'true';
          const localCart = JSON.parse(localStorage.getItem('luxemart_cart') || '[]');
          const localWishlist = JSON.parse(localStorage.getItem('luxemart_wishlist') || '[]');
          
          if (!hasSynced) {
            // 1. Push any local cart items to the server (use update to SET quantity, not add)
            if (localCart.length > 0) {
              await Promise.all(localCart.map((item: CartItem) => api.cart.update(item.productId, item.quantity).catch(() => {})));
            }

            // 2. Push any local wishlist items to the server
            if (localWishlist.length > 0) {
              await Promise.all(localWishlist.map((id: string) => api.wishlist.add(id).catch(() => {})));
            }
            
            sessionStorage.setItem('luxemart_synced', 'true');
          }

          // 3. Fetch canonical merged data from server
          const [serverCart, serverWishlist] = await Promise.all([
            api.cart.get().catch(() => []),
            api.wishlist.get().catch(() => [])
          ]);

          const mappedCart: CartItem[] = serverCart.map((i: any) => ({ productId: i.productId, quantity: i.quantity }));
          setCart(mappedCart.length > 0 ? mappedCart : localCart);
          
          const mappedWishlist = serverWishlist.map((i: any) => i.productId);
          setWishlist(mappedWishlist.length > 0 ? mappedWishlist : localWishlist);
          
        } catch (err) {
          console.error("Sync error:", err);
        }
      };

      syncData();
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('luxemart_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('luxemart_cart', JSON.stringify(cart));
  }, [cart]);

  const toggleWishlist = (productId: string) => {
    const isInWishlist = wishlist.includes(productId);
    
    setWishlist(prev => 
      isInWishlist
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );

    // Sync to server if logged in
    if (user) {
      if (isInWishlist) {
        api.wishlist.remove(productId).catch(() => {});
      } else {
        api.wishlist.add(productId).catch(() => {});
      }
    }
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
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

    // Sync to server if logged in
    if (user) {
      api.cart.add(productId, 1).catch(() => {});
    }
    
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

    // Sync to server if logged in
    if (user) {
      api.cart.update(productId, quantity).catch(() => {});
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));

    // Sync to server if logged in
    if (user) {
      api.cart.remove(productId).catch(() => {});
    }
  };

  const navigateTo = (newView: AppView, productId: string | null = null) => {
    setView(newView);
    setSelectedProductId(productId);
    
    if (newView !== 'shop' && newView !== 'product-detail') {
      setActiveCategoryFilter(null);
    }

    // Update URL
    const newPath = newView === 'product-detail' && productId 
      ? `/product/${productId}` 
      : `/${newView === 'home' ? '' : newView}`;
    
    if (window.location.pathname !== newPath) {
      window.history.pushState({ view: newView, productId }, '', newPath);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductSelect = (productId: string) => {
    navigateTo('product-detail', productId);
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    // Only redirect to home if we're on the main auth page.
    // This allows admin login to stay on the admin view.
    if (view === 'auth') {
      navigateTo('home');
    }
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
    setCart([]);
    setWishlist([]);
    hasSyncedRef.current = false;
    localStorage.removeItem('luxemart_cart');
    localStorage.removeItem('luxemart_wishlist');
    sessionStorage.removeItem('luxemart_synced');
    setView('home');
  };

  useEffect(() => {
    (window as any).handleProductSelect = handleProductSelect;
  }, []);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const state = e.state;
      if (state && state.view) {
        setView(state.view);
        setSelectedProductId(state.productId || null);
      } else {
        const route = getInitialView();
        setView(route.view);
        setSelectedProductId(route.productId);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const path = view === 'product-detail' && selectedProductId 
      ? `/product/${selectedProductId}` 
      : `/${view === 'home' ? '' : view}`;
    trackPageView(path);
  }, [view, selectedProductId]);

  // Secret Admin Shortcut (Ctrl + Alt + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        navigateTo('admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategoryFilter(categoryId);
    setSearchQuery('');
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = () => {
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (orderNumber: string) => {
    setLastOrderNumber(orderNumber);
    setCart([]);
    localStorage.setItem('luxemart_cart', '[]');
    setView('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Admin dashboard – full-screen, bypasses main layout
  if (view === 'admin') {
    return <AdminDashboard user={user} onExit={() => navigateTo('home')} onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {isLoadingApp && <Preloader onComplete={() => setIsLoadingApp(false)} />}
      
      <Navbar 
        products={products}
        currentView={view as any} 
        onNavigate={navigateTo} 
        onCategorySelect={handleCategorySelect}
        onProductSelect={handleProductSelect}
        searchQuery={searchQuery}
        categories={categories}
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
              <img src={getImageUrl(notification.product.image)} alt="" className="w-full h-full object-cover" />
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
        {isLoadingProducts && (view as string) !== 'admin' && (
          <div className="flex items-center justify-center py-40">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {view === 'home' && !isLoadingProducts && (
          <>
            <Hero onShopNow={() => navigateTo('shop')} onViewCollections={() => navigateTo('categories')} />
            <FeaturesBar />
            <Categories 
              categories={categories}
              onCategoryClick={handleCategorySelect} 
              onViewAll={() => navigateTo('categories')} 
            />
            <EditorialSection onExplore={() => navigateTo('shop')} />
            <BestSellers 
              products={products}
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
        
        {view === 'shop' && !isLoadingProducts && (
          <Shop 
            products={products}
            categories={categories}
            searchQuery={searchQuery} 
            initialCategory={activeCategoryFilter} 
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onAddToCart={handleAddToCart}
            onProductClick={handleProductSelect}
          />
        )}

        {view === 'categories' && (
          <CategoriesPage products={products} categories={categories} onCategorySelect={handleCategorySelect} />
        )}

        {view === 'deals' && !isLoadingProducts && (
          <DealsPage 
            products={products}
            wishlist={wishlist} 
            onToggleWishlist={toggleWishlist} 
            onAddToCart={handleAddToCart}
            onProductClick={handleProductSelect}
          />
        )}

        {view === 'product-detail' && selectedProductId && (
          <ProductDetail 
            products={products}
            productId={selectedProductId}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onAddToCart={handleAddToCart}
            onBack={() => setView('shop')}
          />
        )}

        {view === 'about' && <AboutPage onNavigate={navigateTo} />}
        {view === 'profile' && (
          <ProfilePage 
            user={user}
            onLogout={handleLogout}
            onNavigate={navigateTo}
          />
        )}
        {view === 'auth' && (
          <AuthPage 
            onAuthSuccess={handleAuthSuccess} 
            onLogout={handleLogout}
            currentUser={user}
          />
        )}
        {view === 'wishlist' && (
          <WishlistPage 
            products={products}
            wishlist={wishlist} 
            onToggleWishlist={toggleWishlist} 
            onAddToCart={handleAddToCart}
            onShopNow={() => setView('shop')}
            onGoToCart={() => setView('cart')}
          />
        )}
        {view === 'cart' && (
          <CartPage 
            products={products}
            cart={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemove={handleRemoveFromCart}
            onShopNow={() => navigateTo('shop')}
            onCheckout={handleCheckout}
            onAddToCart={handleAddToCart}
          />
        )}

        {view === 'checkout' && (
          <CheckoutPage 
            products={products}
            cart={cart}
            onBack={() => setView('cart')}
            onSuccess={handleOrderSuccess}
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
