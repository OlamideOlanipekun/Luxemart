
import React from 'react';
import { Truck, RotateCcw, Star, ArrowRight } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
  onViewCollections: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopNow, onViewCollections }) => {
  return (
    <section className="bg-white pt-6 pb-12 md:pt-16 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Text Content */}
        <div className="flex-1 space-y-6 md:space-y-8 animate-fadeInLeft text-center md:text-left">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black tracking-widest uppercase">
            New Series 04 Launch
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 leading-[1.0] italic tracking-tighter">
            ELEVATE YOUR <br className="hidden sm:block" /> EVERYDAY <span className="text-blue-600">STYLE</span>
          </h1>
          <p className="text-gray-500 text-base md:text-xl max-w-lg mx-auto md:mx-0 leading-relaxed italic font-medium">
            "Discover premium essentials designed for the modern professional. Quality craftsmanship meets contemporary design."
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button 
              onClick={onShopNow}
              className="bg-slate-900 text-white px-10 py-5 rounded-[1.5rem] font-black text-lg hover:bg-blue-600 transition-all hover:scale-105 shadow-2xl shadow-slate-900/10 italic uppercase tracking-widest flex items-center justify-center gap-3 group"
            >
              Shop Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={onViewCollections}
              className="bg-gray-50 text-slate-900 px-10 py-5 rounded-[1.5rem] font-black text-lg hover:bg-gray-100 transition-all italic border border-gray-100 uppercase tracking-widest"
            >
              Collections
            </button>
          </div>
          <div className="flex justify-center md:justify-start gap-6 md:gap-8 pt-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <Truck className="w-5 h-5 text-blue-600" />
              <span>Global Express</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <RotateCcw className="w-5 h-5 text-blue-600" />
              <span>30-Day Curated Returns</span>
            </div>
          </div>
        </div>

        {/* Image Side */}
        <div className="flex-1 relative animate-fadeInRight w-full max-w-xl md:max-w-none mx-auto">
          <div className="relative z-10 rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-3xl border border-gray-100 aspect-[4/5] sm:aspect-[3/4] md:aspect-auto">
            <img
              src="https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?auto=format&fit=crop&q=80&w=1200"
              alt="Stylish woman shopping"
              className="w-full h-full md:h-[650px] object-cover transition-transform duration-1000 hover:scale-105"
            />
          </div>
          
          {/* Social Proof Badge - Repositioned for mobile visibility */}
          <div className="absolute -bottom-4 -left-2 md:-left-6 md:bottom-12 bg-white p-4 md:p-6 rounded-[2rem] shadow-2xl z-20 flex items-center gap-4 border border-gray-100 animate-fadeInUp animate-delay-300">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/100?u=${i + 10}`}
                  alt="Customer"
                  className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-white shadow-sm"
                />
              ))}
            </div>
            <div>
              <div className="font-black text-[10px] md:text-xs text-slate-900 uppercase tracking-widest">Archived by 10k+ Members</div>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-100 rounded-full blur-[100px] -z-10 opacity-40"></div>
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-100 rounded-full blur-[100px] -z-10 opacity-40"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
