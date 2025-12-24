
import React from 'react';
import { Star, Heart, ShoppingBag, Eye, Plus, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { BEST_SELLERS } from '../constants';
// @ts-ignore
import { Swiper, SwiperSlide } from 'swiper/react';
// @ts-ignore
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

interface BestSellersProps {
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (id: string) => void;
  onProductClick: (id: string) => void;
}

const BestSellers: React.FC<BestSellersProps> = ({ wishlist, onToggleWishlist, onAddToCart, onProductClick }) => {
  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden relative group/section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-20">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black tracking-widest uppercase">
              Curated Selection
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
              Drop <span className="text-blue-600">Archives</span>
            </h2>
            <p className="text-gray-400 text-xs md:text-sm font-black uppercase tracking-[0.2em] italic">
              Global favorites from the Series 04 collection.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Custom Navigation Buttons */}
            <div className="hidden md:flex gap-3">
              <button className="swiper-prev-btn w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center text-slate-400 hover:border-blue-600 hover:text-blue-600 transition-all active:scale-90 bg-white shadow-sm disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button className="swiper-next-btn w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center text-slate-400 hover:border-blue-600 hover:text-blue-600 transition-all active:scale-90 bg-white shadow-sm disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <button 
              className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] flex items-center gap-2 hover:gap-4 transition-all group ml-4"
              onClick={() => (window as any).handleProductSelect?.('')}
            >
              Explore Full Catalog <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative !overflow-visible">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={32}
            slidesPerView={1.2}
            grabCursor={true}
            navigation={{
              prevEl: '.swiper-prev-btn',
              nextEl: '.swiper-next-btn',
            }}
            pagination={{
              clickable: true,
              el: '.swiper-custom-pagination',
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2.2,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
            className="!overflow-visible"
          >
            {BEST_SELLERS.map((product) => (
              <SwiperSlide key={product.id} className="pb-12">
                <div 
                  className="group/card flex flex-col animate-fadeInUp cursor-pointer"
                  onClick={() => onProductClick(product.id)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[3rem] bg-gray-50 mb-8 shadow-md group-hover/card:shadow-3xl transition-all duration-700 group-hover/card:-translate-y-3 border border-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                    />
                    
                    {product.badge && (
                      <div className={`absolute top-6 left-6 px-4 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-2xl ${
                        product.badge === 'SALE' ? 'bg-red-500' : 'bg-blue-600'
                      }`}>
                        {product.badge} EDITION
                      </div>
                    )}

                    <div className="absolute top-6 right-6 flex flex-col gap-3 translate-x-12 opacity-0 md:group-hover/card:translate-x-0 md:group-hover/card:opacity-100 transition-all duration-300">
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
                    
                    <div className="absolute bottom-6 left-6 right-6 translate-y-20 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500 hidden md:block">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onAddToCart(product.id); }}
                        className="w-full bg-slate-900/95 backdrop-blur-xl text-white py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-blue-600 hover:scale-[1.02] transition-all shadow-3xl active:scale-95 border border-white/10 uppercase tracking-widest text-xs"
                      >
                        <Plus className="w-4 h-4" />
                        Quick Archive
                        <ShoppingBag className="w-4 h-4 ml-1" />
                      </button>
                    </div>

                    {/* Mobile direct add button */}
                    <div className="absolute bottom-6 right-6 md:hidden">
                       <button 
                        onClick={(e) => { e.stopPropagation(); onAddToCart(product.id); }}
                        className="p-5 bg-slate-900 text-white rounded-2xl shadow-2xl active:scale-90"
                       >
                         <Plus className="w-6 h-6" />
                       </button>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 px-4" onClick={() => onProductClick(product.id)}>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{product.category}</span>
                       <div className="flex items-center text-yellow-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="ml-1.5 text-xs font-black text-slate-900">{product.rating}</span>
                      </div>
                    </div>
                    <h3 className="font-black text-2xl text-slate-900 group-hover/card:text-blue-600 transition-colors leading-tight italic tracking-tight truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-3 pt-1">
                      <span className="text-3xl font-black text-blue-600 italic tracking-tighter">${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-base text-gray-300 line-through font-bold">${product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        {/* Custom Pagination Container */}
        <div className="mt-12 flex justify-center">
          <div className="swiper-custom-pagination flex gap-2"></div>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;