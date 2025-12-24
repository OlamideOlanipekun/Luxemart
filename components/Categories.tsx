
import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../constants';

interface CategoriesProps {
  onCategoryClick?: (catId: string) => void;
  onViewAll?: () => void;
}

const Categories: React.FC<CategoriesProps> = ({ onCategoryClick, onViewAll }) => {
  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Enhanced Header Section */}
        <div className="flex items-end justify-between mb-16 md:mb-24">
          <div className="relative group">
            <div className="flex items-center gap-3 text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
               <Sparkles className="w-4 h-4" /> Collection Directory
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
              Shop by <span className="text-blue-600">Category</span>
            </h2>
            <div className="absolute -bottom-4 left-0 w-24 h-1.5 bg-blue-600 rounded-full transition-all duration-700 group-hover:w-full"></div>
          </div>
          
          <button 
            onClick={onViewAll}
            className="group flex items-center gap-4 text-slate-900 font-black text-xs uppercase tracking-[0.2em] transition-all hover:text-blue-600"
          >
            <span className="hidden sm:inline">View Full Archive</span>
            <div className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Enhanced Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {CATEGORIES.map((category, index) => (
            <div
              key={category.id}
              onClick={() => onCategoryClick?.(category.id)}
              className="group relative h-[500px] rounded-[3.5rem] overflow-hidden cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.2)] transition-all duration-700 hover:-translate-y-4"
            >
              {/* Background Image with Ken Burns Effect */}
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 ease-out"
              />
              
              {/* Sophisticated Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent transition-opacity duration-700 group-hover:opacity-80"></div>
              <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              {/* Ghost Numbering */}
              <div className="absolute top-12 left-12 text-[100px] font-black text-white/5 italic select-none pointer-events-none tracking-tighter transition-all duration-700 group-hover:text-white/10 group-hover:translate-x-4">
                0{index + 1}
              </div>

              {/* Top Badge */}
              <div className="absolute top-8 right-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-white text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  Series 04
                </div>
              </div>
              
              {/* Content Area */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                <div className="relative z-10 space-y-4">
                  <div className="overflow-hidden">
                    <h3 className="text-white text-4xl md:text-5xl font-black tracking-tighter italic uppercase leading-none transition-transform duration-500 group-hover:text-blue-400">
                      {category.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-700 delay-100">
                    <div className="h-px flex-1 bg-white/20"></div>
                    <span className="text-white/60 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Explore Dept</span>
                    <ArrowRight className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Animated Border interaction */}
              <div className="absolute inset-6 border border-white/0 rounded-[2.5rem] group-hover:border-white/10 transition-all duration-700 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
