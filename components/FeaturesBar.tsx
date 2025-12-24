
import React from 'react';
import { Truck, ShieldCheck, Headphones, RotateCcw } from 'lucide-react';

const FeaturesBar: React.FC = () => {
  const features = [
    { icon: Truck, title: "Global Express", desc: "Complimentary logistics" },
    { icon: ShieldCheck, title: "Secured Vault", desc: "Tier-1 encrypted safety" },
    { icon: Headphones, title: "AI Assistant", desc: "24/7 dedicated styling" },
    { icon: RotateCcw, title: "Curated Return", desc: "30-day effortless swap" }
  ];

  return (
    <div className="bg-white border-y border-gray-100 py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-5 group px-4 py-2 sm:p-0">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <f.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 uppercase tracking-widest italic">{f.title}</div>
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesBar;
