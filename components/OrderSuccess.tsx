
import React from 'react';
import { CheckCircle2, Package, ArrowRight, Truck, Mail } from 'lucide-react';

interface OrderSuccessProps {
  orderNumber: string;
  onContinue: () => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ orderNumber, onContinue }) => {
  return (
    <div className="bg-white min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center space-y-12 animate-fadeIn">
        <div className="relative inline-block">
          <div className="w-32 h-32 bg-green-50 rounded-[3rem] flex items-center justify-center relative z-10 border border-green-100 shadow-2xl shadow-green-500/10">
            <CheckCircle2 className="text-green-600 w-16 h-16 animate-bounce" />
          </div>
          <div className="absolute inset-0 bg-green-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic uppercase">
            Order <span className="text-blue-600">Sealed</span>
          </h1>
          <p className="text-gray-500 text-xl font-medium italic">
            Your archival curation is being prepared for global transit.
          </p>
        </div>

        <div className="bg-gray-50 rounded-[3rem] p-10 md:p-16 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="text-left space-y-2">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Identifier</div>
            <div className="text-2xl font-black text-slate-900 tracking-tight italic">{orderNumber}</div>
          </div>
          <div className="text-left space-y-2">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estimated Arrival</div>
            <div className="text-2xl font-black text-slate-900 tracking-tight italic">4-7 Business Days</div>
          </div>
          
          <div className="md:col-span-2 pt-6 border-t border-gray-200 flex flex-col md:flex-row gap-8 items-center justify-between text-[10px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-3 text-slate-900">
              <Mail className="w-4 h-4 text-blue-600" /> Confirmation Sent
            </div>
            <div className="flex items-center gap-3 text-slate-900">
              <Truck className="w-4 h-4 text-blue-600" /> Tracking Activated
            </div>
            <div className="flex items-center gap-3 text-slate-900">
              <Package className="w-4 h-4 text-blue-600" /> Secured Packaging
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button 
            onClick={onContinue}
            className="bg-slate-900 text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-blue-600 transition-all shadow-3xl flex items-center justify-center gap-4 italic uppercase tracking-widest"
          >
            Continue Exploring <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
