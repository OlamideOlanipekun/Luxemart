
import React from 'react';
import { Sparkles, Shield, Globe } from 'lucide-react';
import { PHILOSOPHY } from '../constants';

const Philosophy: React.FC = () => {
  const IconMap: any = { Sparkles, Shield, Globe };

  return (
    <section className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 italic tracking-tighter">
            THE LUXE <span className="text-blue-600 underline decoration-2 underline-offset-8">MANIFESTO</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {PHILOSOPHY.map((p, i) => {
            const Icon = IconMap[p.icon];
            return (
              <div key={i} className="bg-white p-12 rounded-[4rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 group">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg">
                  <Icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6 italic tracking-tight">{p.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium italic">{p.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
