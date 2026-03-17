import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

interface SaleBannerProps {
  onShopSale: () => void;
}

const SaleBanner: React.FC<SaleBannerProps> = ({ onShopSale }) => {
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', mins: '00', secs: '00' });
  const [targetDate, setTargetDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchCountdown = async () => {
      try {
        const res = await api.products.getPublicSetting('countdown_end');
        if (res && res.value_text) {
          setTargetDate(new Date(res.value_text));
        }
      } catch (err) {
        console.error("Failed to fetch sale countdown", err);
      }
    };
    fetchCountdown();
  }, []);

  const calculateTimeLeft = useCallback(() => {
    if (!targetDate) return;

    const now = new Date().getTime();
    const target = targetDate.getTime();
    const difference = target - now;

    if (difference <= 0) {
      setTimeLeft({ days: '00', hours: '00', mins: '00', secs: '00' });
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setTimeLeft({
      days: days.toString().padStart(2, '0'),
      hours: hours.toString().padStart(2, '0'),
      mins: minutes.toString().padStart(2, '0'),
      secs: seconds.toString().padStart(2, '0')
    });
  }, [targetDate]);

  useEffect(() => {
    if (!targetDate) return;
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate, calculateTimeLeft]);

  return (
    <section className="bg-slate-900 py-20 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="text-center md:text-left space-y-6">
          <div className="text-blue-500 font-bold tracking-widest uppercase text-sm">Limited Time Offer</div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white">End of Season Sale</h2>
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
            { label: 'DAYS', value: timeLeft.days },
            { label: 'HOURS', value: timeLeft.hours },
            { label: 'MINS', value: timeLeft.mins },
            { label: 'SECS', value: timeLeft.secs }
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center mb-3">
                <span className="text-2xl sm:text-3xl md:text-5xl font-black text-white">{item.value}</span>
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
