
import React, { useState, useMemo, useEffect } from 'react';
import { Star, Heart, ShoppingBag, ArrowLeft, Plus, Minus, Send, CheckCircle2, ShieldCheck, Truck, RotateCcw, Clock, Check, AlertCircle, Bell, Sparkles, Quote, Info, ExternalLink } from 'lucide-react';
import {  } from '../constants';
import { Review, Product } from '../types';
import { getProductInsight, getReviewSummary } from '../services/geminiService';
import { getImageUrl } from '../services/api';

interface ProductDetailProps {
  products: Product[];
  productId: string;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (id: string) => void;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ products, productId, wishlist, onToggleWishlist, onAddToCart, onBack }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittedReviews, setSubmittedReviews] = useState<Review[]>([]);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const [isAdded, setIsAdded] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [isNotifySent, setIsNotifySent] = useState(false);
  
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Neutral');
  
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [aiReviewSummary, setAiReviewSummary] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const product = useMemo(() => products.find(p => p.id === productId), [productId, products]);

  // Fetch AI Insights
  useEffect(() => {
    if (product) {
      setIsAiLoading(true);
      getProductInsight(product.name, product.category_id).then(insight => {
        setAiInsight(insight || null);
        setIsAiLoading(false);
      });
    }
  }, [productId]);

  // Track Recently Viewed
  useEffect(() => {
    if (productId) {
      const saved = localStorage.getItem('luxemart_recent');
      let recent: string[] = saved ? JSON.parse(saved) : [];
      
      recent = recent.filter(id => id !== productId);
      recent.unshift(productId);
      
      const updatedRecent = recent.slice(0, 10);
      localStorage.setItem('luxemart_recent', JSON.stringify(updatedRecent));
      setRecentlyViewedIds(updatedRecent);
    }
  }, [productId]);

  const recentlyViewedProducts = useMemo(() => {
    return recentlyViewedIds
      .filter(id => id !== productId)
      .map(id => products.find(p => p.id === id))
      .filter(Boolean);
  }, [recentlyViewedIds, productId, products]);

  const initialReviews: Review[] = useMemo(() => [
    { id: 'r1', userName: 'Alexander V.', rating: 5, comment: 'Absolutely flawless design. The weight and texture of the material are exactly what you expect from LuxeMart.', date: '2024-03-10' },
    { id: 'r2', userName: 'Elena R.', rating: 4, comment: 'Gorgeous piece. Only wish it came in more color variants. Highly recommended otherwise!', date: '2024-02-15' },
    { id: 'r3', userName: 'Marcus T.', rating: 5, comment: 'A staple in my rotation now. The attention to detail is remarkable.', date: '2024-03-20' },
  ], []);

  const allReviews = useMemo(() => {
    return [...initialReviews, ...submittedReviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [initialReviews, submittedReviews]);

  useEffect(() => {
    if (activeTab === 'reviews' && !aiReviewSummary && product) {
      getReviewSummary(product.name, allReviews).then(summary => setAiReviewSummary(summary || null));
    }
  }, [activeTab, product]);

  const ratingSummary = useMemo(() => {
    const summary = [0, 0, 0, 0, 0];
    allReviews.forEach(r => summary[r.rating - 1]++);
    return summary.reverse();
  }, [allReviews]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;

    const review: Review = {
      id: `r-${Date.now()}`,
      userName: 'Current Member',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };

    setSubmittedReviews([review, ...submittedReviews]);
    setNewReview({ rating: 5, comment: '' });
  };

  const handleAddToCartClick = () => {
    if (product) {
      onAddToCart(product.id);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail.trim()) return;
    setIsNotifySent(true);
    setTimeout(() => {
      setIsNotifySent(false);
      setNotifyEmail('');
    }, 4000);
  };

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);
  const stockCount = product.stock_count ?? 0;
  let stockStatus: 'in' | 'low' | 'out' = 'in';
  if (stockCount === 0) stockStatus = 'out';
  else if (stockCount <= 10) stockStatus = 'low';

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = [
    { name: 'Carbon', class: 'bg-slate-900' },
    { name: 'Ivory', class: 'bg-slate-50' },
    { name: 'Azure', class: 'bg-blue-600' },
    { name: 'Tonal', class: 'bg-gray-400' }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Dynamic Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 sticky top-0 z-[60] px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] transition-all group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-900 text-sm hidden sm:inline italic">{product.name}</span>
            <span className="text-gray-200 hidden sm:inline mx-2">|</span>
            <span className="text-blue-600 font-black text-sm">${product.price.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleAddToCartClick}
              className={`hidden md:flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                isAdded ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-blue-600'
              }`}
            >
              {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {isAdded ? 'Added' : 'Quick Acquire'}
            </button>
            <button onClick={() => onToggleWishlist(product.id)} className={`p-2 rounded-full border border-gray-100 ${isWishlisted ? 'text-red-500 bg-red-50' : 'text-gray-400'}`}>
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* LEFT COLUMN: SCROLLING IMAGES */}
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-gray-50 border border-gray-100 group shadow-lg">
                <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                {product.badge && (
                  <div className="absolute top-8 left-8 bg-slate-900/90 backdrop-blur-md text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-xl border border-white/10">
                    {product.badge} EDITION
                  </div>
                )}
              </div>
              
              {/* Secondary Images Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group relative">
                  <img 
                    src={getImageUrl(product.images?.[0] || product.image)} 
                    alt="Detail 1" 
                    className={`w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 ${!product.images?.[0] ? 'scale-150 object-top' : ''}`} 
                  />
                  {!product.images?.[0] && <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>}
                </div>
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group relative">
                  <img 
                    src={getImageUrl(product.images?.[1] || product.image)} 
                    alt="Detail 2" 
                    className={`w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 ${!product.images?.[1] ? 'scale-125 object-bottom' : ''}`} 
                  />
                  {!product.images?.[1] && <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>}
                </div>
              </div>
              
              {/* Feature Image */}
              <div className="aspect-[16/9] rounded-[3rem] overflow-hidden bg-gray-100 border border-gray-100 shadow-md group">
                <img 
                  src={getImageUrl(product.images?.[2] || product.image)} 
                  alt="Lifestyle" 
                  className={`w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ${!product.images?.[2] ? 'scale-[1.02] -translate-y-4' : ''}`} 
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY INFO PANEL */}
          <div className="flex-1">
            <div className="lg:sticky lg:top-32 space-y-10">
              {/* Product Header */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">{product.category_id}</span>
                  {stockStatus === 'low' && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-100 animate-pulse">
                      <AlertCircle className="w-3 h-3" /> Rare Item: {stockCount} Remaining
                    </span>
                  )}
                  {stockStatus === 'out' && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-red-100">
                      <AlertCircle className="w-3 h-3" /> Archival Shortage
                    </span>
                  )}
                </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-[0.9] italic tracking-tight">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                    ))}
                    <span className="ml-2 text-sm font-black text-slate-900">{product.rating}</span>
                  </div>
                  <span className="text-gray-300">/</span>
                  <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors" onClick={() => setActiveTab('reviews')}>
                    {allReviews.length} Member Critiques
                  </span>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-4 py-6 border-y border-gray-100">
                <span className="text-6xl font-black text-blue-600 tracking-tighter italic">${product.price.toFixed(2)}</span>
                {product.original_price && (
                  <span className="text-2xl text-gray-300 line-through font-bold">${product.original_price.toFixed(2)}</span>
                )}
              </div>

              {/* AI Stylist Note */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white border border-blue-100 p-8 rounded-[2.5rem] space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Sparkles className="w-4 h-4 fill-current" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Stylist's Perspective</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-400">
                      <Quote className="w-4 h-4" />
                    </div>
                  </div>
                  {isAiLoading ? (
                    <div className="space-y-2 animate-pulse">
                      <div className="h-4 bg-gray-100 rounded-full w-full"></div>
                      <div className="h-4 bg-gray-100 rounded-full w-2/3"></div>
                    </div>
                  ) : (
                    <p className="text-slate-700 font-medium italic leading-relaxed text-base">
                      "{aiInsight || 'A cornerstone of any modern archival collection. Focuses on silhouette and material integrity above all else.'}"
                    </p>
                  )}
                </div>
              </div>

              {/* Selection Controls */}
              {stockStatus !== 'out' && (
                <div className="space-y-8 animate-fadeIn">
                  {/* Colors */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Archival Palette</label>
                      <span className="text-[10px] font-black text-slate-900 uppercase italic">{selectedColor}</span>
                    </div>
                    <div className="flex gap-4">
                      {colors.map((c) => (
                        <button 
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center p-1 ${
                            selectedColor === c.name ? 'border-blue-600 shadow-lg' : 'border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <div className={`w-full h-full rounded-full ${c.class} shadow-inner border border-black/5`}></div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Metric Selection</label>
                      <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">Sizing Blueprint</button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {sizes.map((s) => (
                        <button 
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`min-w-[70px] py-4 rounded-2xl font-black text-sm transition-all border-2 ${
                            selectedSize === s 
                              ? 'bg-slate-900 border-slate-900 text-white shadow-xl -translate-y-1' 
                              : 'border-gray-100 text-gray-400 hover:border-gray-200'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col xs:flex-row items-stretch gap-4 sm:gap-6 pt-6">
                    <div className="flex items-center bg-gray-50 p-2 rounded-2xl border border-gray-100">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all">
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="w-14 text-center font-black text-xl text-slate-900">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="p-4 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all">
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={handleAddToCartClick}
                      disabled={isAdded}
                      className={`flex-1 py-5 md:py-6 rounded-[2rem] md:rounded-[2.5rem] font-black text-xl md:text-2xl transition-all duration-500 shadow-3xl flex items-center justify-center gap-4 uppercase tracking-widest italic overflow-hidden relative ${
                        isAdded 
                        ? 'bg-green-600 text-white scale-[1.03]' 
                        : 'bg-slate-900 text-white hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      <span className={`flex items-center gap-4 transition-all duration-500 transform ${isAdded ? 'translate-y-12 opacity-0' : 'translate-y-0 opacity-100'}`}>
                        Seal Acquisition <ShoppingBag className="w-7 h-7" />
                      </span>
                      <span className={`absolute flex items-center gap-4 transition-all duration-500 transform ${isAdded ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}`}>
                        Archived <Check className="w-7 h-7" strokeWidth={3} />
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Out of Stock Logic */}
              {stockStatus === 'out' && (
                <div className="bg-gray-50 rounded-[3rem] p-10 border border-gray-100 space-y-6">
                   {!isNotifySent ? (
                    <form onSubmit={handleNotifySubmit} className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Bell className="w-8 h-8 text-blue-600" />
                        <div>
                          <h3 className="font-black text-2xl italic uppercase tracking-tight">Access Restricted</h3>
                          <p className="text-gray-500 text-sm font-medium">Currently unavailable. Join the priority list for restock notification.</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <input 
                          type="email" 
                          required
                          value={notifyEmail}
                          onChange={(e) => setNotifyEmail(e.target.value)}
                          placeholder="Professional Email..."
                          className="flex-1 bg-white border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold focus:outline-none focus:border-blue-600 transition-all shadow-inner"
                        />
                        <button type="submit" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-600 transition-all uppercase tracking-widest italic shadow-xl">
                          Waitlist Me
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col items-center text-center space-y-4 animate-fadeInUp">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                        <Check className="text-white w-8 h-8" strokeWidth={4} />
                      </div>
                      <div>
                        <h3 className="font-black text-2xl italic uppercase tracking-tight">Inclusion Confirmed</h3>
                        <p className="text-gray-500 text-sm font-medium">Notification triggered for {notifyEmail}.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">
                  <Truck className="w-4 h-4 text-blue-600" /> Logistics Included
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">
                  <RotateCcw className="w-4 h-4 text-blue-600" /> 30-Day Transition
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> Verified Archival
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">
                  <Info className="w-4 h-4 text-blue-600" /> Ethical Traceability
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS & REVIEWS TABS */}
        <div className="mt-32">
          <div className="flex justify-start md:justify-center gap-8 md:gap-12 border-b border-gray-100 mb-20 overflow-x-auto no-scrollbar px-5 md:px-0">
            {['details', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-8 text-[11px] font-black uppercase tracking-widest md:tracking-[0.4em] relative transition-all whitespace-nowrap ${
                  activeTab === tab 
                  ? 'text-blue-600 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1.5 after:bg-blue-600 after:rounded-full' 
                  : 'text-gray-400 hover:text-slate-900'
                }`}
              >
                {tab === 'details' ? 'The Technical Blueprint' : `Member Critiques (${allReviews.length})`}
              </button>
            ))}
          </div>

          <div className="max-w-5xl mx-auto px-4">
            {activeTab === 'details' ? (
              <div className="animate-fadeInUp space-y-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
                  <div className="space-y-8">
                    <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Archival Narrative</h3>
                    <p className="text-gray-500 text-lg leading-relaxed font-medium">
                      Every signature piece in our rotation undergoes a rigorous 24-step inspection. The {product.name} focuses on long-term silhouette preservation and textile depth. Designed in collaboration with global design leaders, it represents a definitive movement away from disposable fast-fashion cycles.
                    </p>
                    <div className="flex items-center gap-4 text-blue-600 font-black uppercase tracking-[0.2em] text-xs cursor-pointer group hover:gap-6 transition-all">
                      Download Material Traceability Report <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { l: 'Architectural Style', v: 'Modern Minimalist' },
                      { l: 'Base Material', v: 'Aerospace-grade Composite' },
                      { l: 'Origin Registry', v: 'District 09 / Milan' },
                      { l: 'Impact Rating', v: 'Certified Sustainable (A+)' },
                      { l: 'Closure System', v: 'Integrated Precision Seal' }
                    ].map((spec, i) => (
                      <div key={i} className="flex justify-between items-center py-5 border-b border-gray-50 group">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-blue-600 transition-colors">{spec.l}</span>
                        <span className="text-slate-900 font-bold italic group-hover:translate-x-1 transition-transform">{spec.v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Icons Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { i: ShieldCheck, t: 'Durable Construction', d: 'Reinforced stress points' },
                    { i: Sparkles, t: 'Antimicrobial Finish', d: 'Long-term freshness' },
                    { i: Truck, t: 'Archival Packaging', d: 'Recyclable blueprints' },
                    { i: Clock, t: 'Timed Release', d: 'Season-neutral design' }
                  ].map((feat, i) => (
                    <div key={i} className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 text-center space-y-4 hover:shadow-xl transition-all">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto text-blue-600 shadow-sm">
                        <feat.i className="w-7 h-7" />
                      </div>
                      <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs italic">{feat.t}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{feat.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-fadeInUp space-y-20 pb-20">
                {/* AI Review Summary Header */}
                  <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-16 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600 rounded-full blur-[100px] -z-10 opacity-20"></div>
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                    <div className="text-center md:text-left space-y-4">
                  <div className="text-7xl md:text-8xl font-black italic tracking-tighter text-blue-400">{product.rating}</div>
                      <div className="flex justify-center md:justify-start text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                      <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Consensus Data</div>
                    </div>
                    
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-3 text-blue-400">
                        <Sparkles className="w-5 h-5 fill-current" />
                        <span className="text-xs font-black uppercase tracking-[0.3em]">Community Sentiment Synthesis</span>
                      </div>
                      <div className="space-y-4 text-lg font-medium italic text-white/80 leading-relaxed">
                        {aiReviewSummary ? (
                          <div className="whitespace-pre-line">{aiReviewSummary}</div>
                        ) : (
                          <div className="space-y-2 animate-pulse">
                            <div className="h-4 bg-white/10 rounded-full w-full"></div>
                            <div className="h-4 bg-white/10 rounded-full w-5/6"></div>
                            <div className="h-4 bg-white/10 rounded-full w-4/6"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Form */}
                  <div className="bg-gray-50 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 border border-gray-100">
                  <h3 className="text-3xl font-black text-slate-900 mb-8 italic uppercase tracking-tight">Add Your <span className="text-blue-600">Critique</span></h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-10">
                    <div className="flex flex-col gap-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rating Level</label>
                    <div className="flex flex-wrap gap-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className={`p-5 rounded-2xl border-2 transition-all ${newReview.rating >= star ? 'border-blue-600 text-blue-600 bg-white shadow-xl' : 'border-gray-200 text-gray-300'}`}
                          >
                            <Star className={`w-7 h-7 ${newReview.rating >= star ? 'fill-current' : ''}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Member Observations</label>
                      <textarea
                        required
                        placeholder="Detail your observations on silhouette, material integrity, and overall impact..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="w-full bg-white border-2 border-gray-100 rounded-[2.5rem] p-8 text-lg font-medium focus:outline-none focus:border-blue-600 focus:shadow-2xl transition-all min-h-[180px]"
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      className="w-full sm:w-auto bg-slate-900 text-white px-12 py-6 rounded-[2rem] font-black text-lg hover:bg-blue-600 transition-all hover:scale-[1.03] active:scale-[0.98] shadow-2xl flex items-center justify-center gap-4 uppercase tracking-widest italic"
                    >
                      Post Narrative <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>

                {/* Review List */}
                <div className="space-y-12">
                  {allReviews.map((review) => (
                    <div key={review.id} className="pb-12 border-b border-gray-50 flex flex-col md:flex-row gap-6 md:gap-12 group">
                      <div className="w-full md:w-52 md:shrink-0 space-y-3">
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                        <div className="text-xl font-black text-slate-900 italic tracking-tight">{review.userName}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{review.date}</div>
                        <div className="pt-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100">
                            <CheckCircle2 className="w-3 h-3" /> Verified Member
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 relative">
                        <p className="text-gray-500 text-xl font-medium leading-relaxed italic pr-12">
                          "{review.comment}"
                        </p>
                        <div className="flex gap-8 mt-10">
                          <button className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors">Helpful Insight (24)</button>
                          <button className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] hover:text-red-500 transition-colors">Flag Archival Issue</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RECENTLY VIEWED CAROUSEL */}
        {recentlyViewedProducts.length > 0 && (
          <div className="mt-40 border-t border-gray-100 pt-24">
            <div className="flex items-center justify-between mb-16">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
                  <Clock className="text-white w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Previous <span className="text-blue-600">Interests</span></h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1 italic">Items from your recent archival sessions</p>
                </div>
              </div>
              <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hidden md:flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:gap-5 transition-all">
                Back to Top <Plus className="w-4 h-4 rotate-45" />
              </button>
            </div>
            
            <div className="relative -mx-4 md:-mx-8">
              <div className="flex overflow-x-auto pb-12 gap-10 no-scrollbar scroll-smooth snap-x px-4 md:px-8">
                {recentlyViewedProducts.map((p) => p && (
                  <div 
                    key={p.id} 
                    className="min-w-[280px] md:min-w-[340px] group snap-start cursor-pointer space-y-6"
                    onClick={() => {
                      (window as any).handleProductSelect?.(p.id);
                    }}
                  >
                    <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden bg-gray-50 border border-gray-100 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 group-hover:-translate-y-4">
                      <img src={getImageUrl(p.image)} alt={p.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors"></div>
                      <div className="absolute inset-0 border-[12px] border-white/0 group-hover:border-white/10 transition-all duration-700 pointer-events-none rounded-[3rem]"></div>
                    </div>
                    <div className="px-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{p.category_id}</span>
                        <div className="flex items-center text-yellow-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="ml-1 text-[10px] font-black text-slate-900">{p.rating}</span>
                        </div>
                      </div>
                      <h4 className="font-black text-slate-900 text-2xl line-clamp-1 italic tracking-tight group-hover:text-blue-600 transition-colors">{p.name}</h4>
                      <div className="text-3xl font-black text-blue-600 tracking-tighter italic">${p.price.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
