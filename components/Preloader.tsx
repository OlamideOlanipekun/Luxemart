
import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsExiting(true), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isExiting) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [isExiting, onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-all duration-700 ease-in-out ${
      isExiting ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'
    }`}>
      <div className="relative">
        {/* Animated Brand Mark */}
        <div className="flex flex-col items-center gap-6 animate-fadeInUp">
          <div className="relative">
            <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/30 animate-pulse">
              <ShoppingCart className="text-white w-10 h-10" fill="currentColor" />
            </div>
            {/* Spinning ring around the logo */}
            <div className="absolute inset-[-10px] border-2 border-blue-100 rounded-[2.5rem] border-t-blue-600 animate-spin [animation-duration:3s]"></div>
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">LuxeMart</h1>
            <div className="flex items-center gap-3 justify-center">
              <span className="w-8 h-px bg-gray-200"></span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Est. 2018</span>
              <span className="w-8 h-px bg-gray-200"></span>
            </div>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-48 space-y-3">
          <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
            <div 
              className="h-full bg-blue-600 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[9px] font-black text-gray-300 uppercase tracking-widest">
            <span>Archiving Collection</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute bottom-10 left-10 text-[10px] font-black text-gray-200 uppercase tracking-[0.5em] vertical-text hidden md:block">
        Luxury Defined
      </div>
      <div className="absolute top-10 right-10 text-[10px] font-black text-gray-200 uppercase tracking-[0.5em] hidden md:block">
        Series 04 / Global
      </div>
    </div>
  );
};

export default Preloader;
