
import React from 'react';
import { Star, Heart, ShoppingBag, Eye, Plus, ArrowRight, ChevronLeft, ChevronRight, Sparkles, Hash } from 'lucide-react';
import { BEST_SELLERS } from '../constants';
// @ts-ignore
import { Swiper, SwiperSlide } from 'swiper/react';
// @ts-ignore
import { Navigation, Pagination, Autoplay, FreeMode } from 'swiper/modules';

interface BestSellersProps {
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (id: string) => void;
  onProductClick: (id: string) => void;
}

const BestSellers: React.FC<BestSellersProps> = ({ wishlist, onToggleWishlist, onAddToCart, onProductClick }) => {
  return (
    <section className="py-32 md:py-48 bg-white overflow-hidden relative group/section">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[25vw] font-black text-gray-50 italic select-none tracking-tighter opacity-70 leading-none">
          ARCHIVE
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Editorial Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24 md:mb-32">
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-3 text-blue-600">
              <Sparkles className="w-5 h-5 fill-current animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Global Drop Archives</span>
            </div>
            <h2 className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter italic uppercase leading-[0.8] transition-all">
              The <span className="text-blue-600">Series 04</span> <br/>Selection
            </h2>
            <div className="h-2 w-32 bg-blue-600 rounded-full mt-4"></div>
          </div>
          
          <div className="flex flex-col items-start lg:items-end gap-8">
            <p className="text-gray-400 text-sm md:text-base font-bold uppercase tracking-widest italic max-w-xs lg:text-right leading-relaxed">
              Curated architectural pieces chosen for their permanent influence on the contemporary rotation.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex gap-3">
                <button className="swiper-prev-btn w-16 h-16 rounded-full border-2 border-gray-100 flex items-center justify-center text-slate-400 hover:border-blue-600 hover:bg-blue-600 hover:text-white transition-all active:scale-90 bg-white shadow-xl disabled:opacity-30">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button className="swiper-next-btn w-16 h-16 rounded-full border-2 border-gray-100 flex items-center justify-center text-slate-400 hover:border-blue-600 hover:bg-blue-600 hover:text-white transition-all active:scale-90 bg-white shadow-xl disabled:opacity-30">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* The Staggered Runway Swiper */}
        <div className="relative !overflow-visible">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, FreeMode]}
            spaceBetween={40}
            slidesPerView={1.2}
            freeMode={true}
            grabCursor={true}
            navigation={{
              prevEl: '.swiper-prev-btn',
              nextEl: '.swiper-next-btn',
            }}
            pagination={{
              clickable: true,
              el: '.swiper-custom-pagination',
            }}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3.2 },
              1280: { slidesPerView: 4 },
            }}
            className="!overflow-visible"
          >
            {BEST_SELLERS.map((product, index) => (
              <SwiperSlide 
                key={product.id} 
                className={`pb-20 transition-all duration-700 ${index % 2 !== 0 ? 'md:translate-y-20' : ''}`}
              >
                <div 
                  className="group/card flex flex-col cursor-pointer perspective-1000"
                  onClick={() => onProductClick(product.id)}
                >
                  {/* Card Visual Container */}
                  <div className="relative aspect-[3/4.5] overflow-hidden rounded-[4rem] bg-gray-50 mb-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] group-hover/card:shadow-[0_50px_100px_-20px_rgba(37,99,235,0.2)] transition-all duration-1000 border border-gray-100">
                    
                    {/* Scanning Line Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/0 via-blue-500/20 to-blue-500/0 h-[2px] w-full z-20 -translate-y-full group-hover/card:translate-y-[800%] transition-transform duration-[2000ms] ease-in-out pointer-events-none opacity-0 group-hover/card:opacity-100"></div>

                    {/* Image Layer */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover/card:scale-110 group-hover/card:rotate-1"
                    />

                    {/* Gradient & Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent opacity-60 group-hover/card:opacity-80 transition-opacity duration-700"></div>
                    
                    {/* Ghost Number / Archival ID */}
                    <div className="absolute top-10 left-10 flex items-center gap-2 z-10">
                      <Hash className="w-4 h-4 text-white/40" />
                      <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                        {1024 + index} / Series 04
                      </span>
                    </div>

                    {/* Side Action Menu */}
                    <div className="absolute top-10 right-10 flex flex-col gap-4 translate-x-12 opacity-0 group-hover/card:translate-x-0 group-hover/card:opacity-100 transition-all duration-500 delay-100 z-30">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
                        className={`w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center transition-all active:scale-90 hover:bg-white hover:text-red-500 ${
                          wishlist.includes(product.id) ? 'text-red-500 bg-white' : 'text-white'
                        }`} 
                      >
                        <Heart className={`w-6 h-6 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button 
                        className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white transition-all active:scale-90 hover:bg-white hover:text-blue-600"
                        onClick={(e) => { e.stopPropagation(); onProductClick(product.id); }}
                      >
                        <Eye className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Bottom Content Card - Floating Glassmorphism */}
                    <div className="absolute bottom-10 left-10 right-10 z-20">
                      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 space-y-4 translate-y-4 group-hover/card:translate-y-0 transition-transform duration-700">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em]">{product.category}</span>
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-[10px] font-black text-white">{product.rating}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-white text-2xl md:text-3xl font-black italic tracking-tighter truncate leading-tight">
                          {product.name}
                        </h3>

                        <div className="flex items-center justify-between pt-2">
                           <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-black text-white italic tracking-tighter">${product.price.toFixed(0)}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-white/40 line-through font-bold">${product.originalPrice.toFixed(0)}</span>
                              )}
                           </div>
                           <button 
                            onClick={(e) => { e.stopPropagation(); onAddToCart(product.id); }}
                            className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-white hover:text-blue-600 transition-all shadow-xl active:scale-90"
                           >
                              <Plus className="w-6 h-6" />
                           </button>
                        </div>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  </div>

                  {/* Card Meta Footer (Visible by default) */}
                  <div className="px-10 flex items-center justify-between opacity-100 group-hover/card:opacity-0 transition-opacity duration-500">
                    <div className="h-px flex-1 bg-gray-100"></div>
                    <div className="px-6 text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] italic">Series Entry 0{index + 1}</div>
                    <div className="h-px flex-1 bg-gray-100"></div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        {/* Progress Pagination */}
        <div className="mt-20 md:mt-32 flex flex-col items-center gap-8">
           <div className="swiper-custom-pagination flex gap-3 h-1 justify-center items-center w-64 bg-gray-50 rounded-full overflow-hidden"></div>
           <button 
            onClick={() => (window as any).handleProductSelect?.('')}
            className="flex items-center gap-4 bg-slate-900 text-white px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.3em] italic hover:bg-blue-600 transition-all shadow-3xl group"
           >
              View Full Archives <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
           </button>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
