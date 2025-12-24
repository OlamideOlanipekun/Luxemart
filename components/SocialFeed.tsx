
import React from 'react';
import { Instagram, ArrowRight } from 'lucide-react';
import { SOCIAL_FEED } from '../constants';

interface SocialFeedProps {
  onJoin: () => void;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ onJoin }) => {
  return (
    <section className="py-24 bg-white border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 text-blue-600 mb-4 font-black uppercase tracking-[0.3em] text-[10px]">
              <Instagram className="w-4 h-4" /> Lifestyle Feed
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 italic tracking-tighter">
              CURATED BY <span className="text-blue-600">YOU</span>
            </h2>
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] md:max-w-xs text-right">
            Tag your moments with #LuxeMartArchives for a chance to be featured in our seasonal lookbook.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {SOCIAL_FEED.map((img, i) => (
            <div key={i} className="aspect-square rounded-3xl overflow-hidden relative group cursor-pointer shadow-md">
              <img src={img} alt="Lifestyle" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram className="text-white w-8 h-8" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
          <button 
            onClick={onJoin}
            className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] italic hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-4"
          >
            Join the collective <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SocialFeed;
