
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface EditorialSectionProps {
  onExplore: () => void;
}

const EditorialSection: React.FC<EditorialSectionProps> = ({ onExplore }) => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 relative order-2 lg:order-1">
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-3xl border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1200" 
                alt="Editorial Look" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-600 rounded-[3rem] p-8 text-white flex flex-col justify-center shadow-2xl hidden md:flex">
              <div className="text-4xl font-black italic">Archive</div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mt-2">Series 04</div>
            </div>
          </div>
          
          <div className="flex-1 space-y-10 order-1 lg:order-2">
            <div className="space-y-4">
              <span className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] bg-blue-50 px-4 py-1.5 rounded-full">
                Editorial Showcase
              </span>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] italic tracking-tight">
                THE ART OF <br/>PERMANENT <span className="text-blue-600">STYLE</span>
              </h2>
            </div>
            <p className="text-gray-500 text-xl font-medium leading-relaxed italic border-l-4 border-blue-600 pl-8">
              "We don't design for seasons. We design for a lifetime of significance. Our Series 04 collection explores the intersection of brutalist architecture and textile innovation."
            </p>
            <div className="space-y-6 pt-6">
              <p className="text-gray-400 leading-relaxed">
                Discover pieces that adapt to your environment. From the bustling morning commute to the high-stakes evening gala, our archival pieces provide the foundation for an effortless existence.
              </p>
              <button 
                onClick={onExplore}
                className="flex items-center gap-4 text-slate-900 font-black uppercase tracking-[0.2em] text-xs hover:text-blue-600 transition-all group"
              >
                Explore the Lookbook <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorialSection;
