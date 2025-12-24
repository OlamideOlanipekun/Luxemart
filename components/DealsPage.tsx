
import React, { useState, useEffect, useMemo } from 'react';
import { Tag, Timer, Flame, Sparkles, Copy, Check, ShoppingBag, Heart, Star, Eye, Plus } from 'lucide-react';
import { ALL_PRODUCTS } from '../constants';

interface DealsPageProps {
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (id: string) => void;
  onProductClick: (id: string) => void;
}

const DealsPage: React.FC<DealsPageProps> = ({ wishlist, onToggleWishlist, onAddToCart, onProductClick }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ h: 14, m: 45, s: 0 });

  const dealProducts = useMemo(() => {
    return ALL_PRODUCTS.filter(p => p.originalPrice && p.originalPrice > p.price);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <section className="bg-slate-900 pt-16 pb-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <div className="grid-pattern w-full h-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-black mb-8 animate-pulse uppercase tracking-[0.2em]">
              <Flame className="w-4 h-4 fill-current" />
              Flash Sale Live
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter uppercase italic leading-[0.9]">
              Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500">Savings</span>
            </h1>
            <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mb-16 font-medium leading-relaxed italic">
              Curated luxury at unprecedented values. Limited edition releases and archived classics up to 60% off.
            </p>

            <div className="flex gap-6 md:gap-10">
              {[
                { label: 'Hours', val: timeLeft.h },
                { label: 'Mins', val: timeLeft.m },
                { label: 'Secs', val: timeLeft.s }
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] flex items-center justify-center mb-4 shadow-2xl">
                    <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">{String(t.val).padStart(2, '0')}</span>
                  </div>
                  <span className="text-blue-500 text-[10px] font-black tracking-[0.3em] uppercase">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { code: 'LUXE10', discount: 'Extra 10% Off', desc: 'Activewear & Fashion', color: 'blue' },
            { code: 'TECH20', discount: '$20 Flat Off', desc: 'Signature Tech Items', color: 'slate' },
            { code: 'SHIPFREE', discount: 'Free Shipping', desc: 'Express Worldwide', color: 'green' }
          ].map((coupon) => (
            <div key={coupon.code} className="bg-white p-8 rounded-[3rem] shadow-2xl border border-gray-100 flex items-center justify-between group hover:-translate-y-2 transition-all duration-500">
              <div>
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">{coupon.desc}</div>
                <div className="text-3xl font-black text-slate-900 italic tracking-tight">{coupon.discount}</div>
              </div>
              <button 
                onClick={() => copyToClipboard(coupon.code)}
                className="flex items-center gap-3 bg-gray-50 px-6 py-4 rounded-[1.5rem] border-2 border-dashed border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all active:scale-95 shadow-inner"
              >
                <span className="font-mono font-black text-slate-900 text-lg">{coupon.code}</span>
                {copiedCode === coupon.code ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/40">
                <Tag className="text-white w-8 h-8" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Active Offers</h2>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">Exclusive Tier Pricing</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-red-500 font-black text-sm uppercase tracking-widest bg-red-50 px-6 py-3 rounded-full border border-red-100">
              <Sparkles className="w-4 h-4 fill-current" />
              Limited Stock
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {dealProducts.map((product) => {
              const discountPercent = Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100);
              
              return (
                <div key={product.id} className="group flex flex-col animate-fadeInUp cursor-pointer">
                  <div 
                    className="relative aspect-[3/4] overflow-hidden rounded-[3rem] bg-gray-100 mb-8 shadow-xl transition-all duration-700 group-hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] group-hover:-translate-y-2"
                    onClick={() => onProductClick(product.id)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    
                    <div className="absolute top-6 left-6 flex flex-col gap-3">
                      <div className="bg-red-600 text-white text-xs font-black px-4 py-2 rounded-full tracking-tighter shadow-2xl shadow-red-500/50 uppercase">
                        {discountPercent}% OFF
                      </div>
                      <div className="bg-slate-900/90 backdrop-blur-xl text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] flex items-center gap-2 border border-white/10">
                        <Tag className="w-3 h-3 text-blue-400" /> Save ${(product.originalPrice! - product.price).toFixed(0)}
                      </div>
                    </div>

                    <div className="absolute top-6 right-6 flex flex-col gap-2 translate-x-16 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
                        className={`p-3.5 bg-white/95 backdrop-blur-xl rounded-full shadow-2xl transition-all active:scale-90 ${
                          wishlist.includes(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button 
                        className="p-3.5 bg-white/95 backdrop-blur-xl rounded-full shadow-2xl text-gray-400 hover:text-blue-600 transition-all active:scale-90"
                        onClick={(e) => { e.stopPropagation(); onProductClick(product.id); }}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="absolute bottom-6 left-6 right-6 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onAddToCart(product.id); }}
                        className="w-full bg-slate-900/95 backdrop-blur-xl text-white py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-blue-600 hover:scale-[1.02] transition-all shadow-2xl active:scale-95 border border-white/10 uppercase tracking-widest text-xs"
                      >
                        <Plus className="w-4 h-4" />
                        Quick Add
                        <ShoppingBag className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 px-3" onClick={() => onProductClick(product.id)}>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{product.category}</span>
                    </div>
                    <h3 className="font-black text-xl text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 italic leading-tight">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-yellow-400 bg-yellow-400/5 px-2.5 py-1 rounded-xl">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="ml-1.5 text-xs font-black text-slate-900">{product.rating}</span>
                      </div>
                      <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">({product.reviews})</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-black text-blue-600 tracking-tighter italic">${product.price.toFixed(2)}</span>
                      <span className="text-base text-gray-400 line-through font-bold decoration-red-500/30 decoration-2">${product.originalPrice?.toFixed(2)}</span>
                    </div>

                    <div className="space-y-3 pt-4">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                        <span className="text-red-500 flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                          High Demand
                        </span>
                        <span className="text-gray-400">82% Claimed</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner p-[1px]">
                        <div className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.3)]" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DealsPage;
