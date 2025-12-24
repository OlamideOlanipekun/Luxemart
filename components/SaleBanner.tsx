
import React from 'react';

interface SaleBannerProps {
  onShopSale: () => void;
}

const SaleBanner: React.FC<SaleBannerProps> = ({ onShopSale }) => {
  return (
    <section className="bg-slate-900 py-20 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="text-center md:text-left space-y-6">
          <div className="text-blue-500 font-bold tracking-widest uppercase text-sm">Limited Time Offer</div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-white">End of Season Sale</h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-lg">
            Up to 50% off on selected items. Don't miss out on our biggest sale of the year.
          </p>
          <button 
            onClick={onShopSale}
            className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-white/5"
          >
            Shop the Sale
          </button>
        </div>

        <div className="flex gap-4 md:gap-8">
          {[
            { label: 'DAYS', value: '02' },
            { label: 'HOURS', value: '14' },
            { label: 'MINS', value: '45' }
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-28 md:h-28 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl flex items-center justify-center mb-3">
                <span className="text-4xl md:text-5xl font-black text-white">{item.value}</span>
              </div>
              <span className="text-gray-400 text-xs font-bold tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SaleBanner;
