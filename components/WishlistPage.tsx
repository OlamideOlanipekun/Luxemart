
import React from 'react';
import { Heart, ShoppingBag, ArrowRight, Star, Trash2, Plus } from 'lucide-react';
import {  } from '../constants';
import { Product } from '../types';
import { getImageUrl } from '../services/api';

interface WishlistPageProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (id: string) => void;
  onShopNow: () => void;
  onGoToCart: () => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ products, wishlist, onToggleWishlist, onAddToCart, onShopNow, onGoToCart }) => {
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header */}
      <section className="bg-gray-50 border-b border-gray-100 py-16 md:py-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/30 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 animate-fadeInUp">
            <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={onShopNow}>Home</span>
            <span>/</span>
            <span className="text-blue-600 font-medium italic">Your Wishlist</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fadeInUp">
            <div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight italic">
                Saved <span className="text-red-500">Curations</span>
              </h1>
              <p className="text-gray-500 text-lg mt-4 font-medium italic">
                {wishlistedProducts.length} items waiting for your selection.
              </p>
            </div>
            {wishlistedProducts.length > 0 && (
              <button 
                onClick={() => {
                  wishlistedProducts.forEach(p => onAddToCart(p.id));
                }}
                className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs"
              >
                Move All to Cart <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {wishlistedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {wishlistedProducts.map((product) => (
              <div key={product.id} className="group flex flex-col animate-fadeInUp">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[3rem] bg-gray-100 mb-6 shadow-md transition-all duration-500 group-hover:shadow-2xl">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  <div className="absolute top-5 right-5">
                    <button 
                      onClick={() => onToggleWishlist(product.id)}
                      className="p-3 bg-white/95 backdrop-blur-md rounded-full shadow-lg text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <button 
                      onClick={() => onAddToCart(product.id)}
                      className="w-full bg-slate-900/95 backdrop-blur-md text-white py-4 rounded-[1.8rem] font-bold flex items-center justify-center gap-2 hover:bg-blue-600 hover:scale-[1.02] transition-all shadow-2xl active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Move to Cart</span>
                      <ShoppingBag className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-3 px-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-1 italic">
                      {product.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-yellow-400 bg-yellow-400/5 px-2 py-0.5 rounded-lg">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="ml-1 text-xs font-black text-slate-900">{product.rating}</span>
                    </div>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">({product.reviews_count} reviews)</span>
                  </div>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-black text-blue-600">${product.price.toFixed(2)}</span>
                    {product.original_price && (
                      <span className="text-sm text-gray-400 line-through font-bold">${product.original_price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-gray-50/50 rounded-[5rem] border-4 border-dashed border-gray-100 flex flex-col items-center">
            <div className="relative mb-10">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl relative z-10">
                <Heart className="w-14 h-14 text-gray-200" />
              </div>
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-6 italic">Your Wishlist is <span className="text-blue-600 underline decoration-2 underline-offset-8">Untouched</span></h3>
            <p className="text-gray-500 text-xl max-w-md mx-auto leading-relaxed mb-12">
              Our archive is vast and waiting for your curation. Start saving items that resonate with your style.
            </p>
            <button 
              onClick={onShopNow}
              className="px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl hover:bg-blue-600 transition-all shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] flex items-center gap-4 group"
            >
              Start Curating <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        )}
      </section>

      {wishlistedProducts.length > 0 && (
        <section className="bg-slate-900 py-16 md:py-32 mx-4 md:mx-12 rounded-[3rem] md:rounded-[5rem] overflow-hidden relative">
          <div className="absolute inset-0 grid-pattern opacity-5"></div>
          <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 italic tracking-tighter">Secure Your <span className="text-blue-500">Selections</span></h2>
            <p className="text-gray-400 text-xl mb-12 font-medium">
              Items in high demand may sell out. Complete your order today to ensure these premium pieces become part of your collection.
            </p>
            <button 
              onClick={onGoToCart}
              className="bg-white text-slate-900 px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-blue-500 hover:text-white transition-all hover:scale-105 uppercase tracking-widest italic"
            >
              Checkout My Curations
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default WishlistPage;
