
import React from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';
import {  } from '../constants';
import { CartItem, Product } from '../types';

interface CartPageProps {
  products: Product[];
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onShopNow: () => void;
  onCheckout: () => void;
  onAddToCart: (productId: string) => void;
}

const CartPage: React.FC<CartPageProps> = ({ products, cart, onUpdateQuantity, onRemove, onShopNow, onCheckout, onAddToCart }) => {
  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...product, ...item };
  }).filter(item => item.id);

  const subtotal = cartItems.reduce((acc, item) => acc + ((item.price || 0) * item.quantity), 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const tax = subtotal * 0.08; 
  const total = subtotal + shipping + tax;

  const activeCategories = Array.from(new Set(cartItems.map(item => item.category_id)));
  const recommendations = products
    .filter(p => activeCategories.includes(p.category_id) && !cart.some(c => c.productId === p.id))
    .slice(0, 4);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-white">
        <div className="relative mb-10">
          <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center relative z-10">
            <ShoppingBag className="w-16 h-16 text-gray-200" />
          </div>
          <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 italic uppercase tracking-tighter">Your Vault is <span className="text-blue-600">Empty</span></h2>
        <p className="text-gray-500 text-lg max-w-sm text-center mb-10 font-medium">
          The archive is vast. Explore our latest drops and secure your essentials today.
        </p>
        <button 
          onClick={onShopNow}
          className="bg-slate-900 text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-blue-600 transition-all hover:scale-105 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] flex items-center gap-4 group italic uppercase tracking-widest"
        >
          Explore Collection <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-32">
      <div className="bg-gray-50 border-b border-gray-100 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-100/20 blur-[100px] -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 uppercase tracking-widest font-black">
            <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={onShopNow}>Archive</span>
            <span>/</span>
            <span className="text-blue-600 font-medium">Checkout Progress</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight italic">
            Cart <span className="text-blue-600">Review</span>
          </h1>
          <p className="text-gray-500 mt-4 text-xl font-medium italic">Finalizing your curation of {cartItems.length} signature pieces.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="flex-1 space-y-10">
            <div className="hidden md:grid grid-cols-6 pb-8 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-6">
              <div className="col-span-3">Item Curation</div>
              <div className="text-center">Units</div>
              <div className="text-center">Valuation</div>
              <div className="text-right">Aggregate</div>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="group relative flex flex-col md:grid md:grid-cols-6 items-center gap-6 md:gap-8 p-5 md:p-8 bg-white rounded-[2.5rem] md:rounded-[3.5rem] border border-gray-100 hover:border-blue-200 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] transition-all duration-700">
                <div className="col-span-3 flex items-center gap-8 w-full">
                  <div className="w-32 h-44 bg-gray-50 rounded-[2.5rem] overflow-hidden shrink-0 shadow-lg border border-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] bg-blue-50 px-3 py-1 rounded-full">{item.category_id}</span>
                    <h3 className="font-black text-2xl text-slate-900 group-hover:text-blue-600 transition-colors italic leading-tight">{item.name}</h3>
                    <div className="flex items-center gap-6 pt-4">
                      <button 
                        onClick={() => onRemove(item.productId)}
                        className="text-[10px] font-black text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all flex items-center gap-2 uppercase tracking-widest border border-red-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Decommission
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex md:block justify-between items-center w-full md:w-auto">
                  <span className="md:hidden text-[10px] font-black text-gray-400 uppercase tracking-widest">Units</span>
                  <div className="flex items-center justify-center gap-5 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <button 
                      onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all active:scale-90"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-black text-slate-900 text-xl w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all active:scale-90"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex md:block justify-between items-center w-full md:w-auto text-center">
                  <span className="md:hidden text-[10px] font-black text-gray-400 uppercase tracking-widest">Valuation</span>
                  <div className="font-black text-xl text-slate-400 tracking-tighter">${item.price?.toFixed(2)}</div>
                </div>

                <div className="flex md:block justify-between items-center w-full md:w-auto text-right">
                  <span className="md:hidden text-[10px] font-black text-gray-400 uppercase tracking-widest">Aggregate</span>
                  <div className="font-black text-3xl text-blue-600 tracking-tighter italic">
                    ${((item.price || 0) * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="w-full lg:w-[400px] shrink-0">
            <div className="bg-slate-900 rounded-[3rem] lg:rounded-[4rem] p-8 md:p-12 text-white shadow-3xl sticky top-32 border border-white/5 overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[120px] -z-10 opacity-20 transition-all group-hover:opacity-30"></div>
              
              <h2 className="text-3xl font-black italic tracking-tight mb-12 pb-8 border-b border-white/10 uppercase">
                Order <span className="text-blue-400 underline decoration-2 underline-offset-8">Summary</span>
              </h2>
              
              <div className="space-y-8 mb-12">
                <div className="flex justify-between items-center text-gray-400 font-bold tracking-wide">
                  <span>Gross Subtotal</span>
                  <span className="text-white text-xl font-black">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400 font-bold tracking-wide">
                  <span>Logistics</span>
                  <span className={shipping === 0 ? 'text-green-400 font-black' : 'text-white font-black'}>
                    {shipping === 0 ? 'COMPLIMENTARY' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-400 font-bold tracking-wide">
                  <span>Estimated Tax</span>
                  <span className="text-white font-black">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-10 border-t border-white/10 mb-12">
                <div className="flex justify-between items-end">
                  <span className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">Total Aggregate</span>
                  <span className="text-6xl font-black tracking-tighter text-white italic">${total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={onCheckout}
                className="w-full bg-blue-600 text-white py-6 md:py-8 rounded-[2rem] md:rounded-[2.5rem] font-black text-xl md:text-2xl hover:bg-blue-500 transition-all hover:scale-[1.02] shadow-[0_30px_60px_-15px_rgba(37,99,235,0.4)] active:scale-[0.98] flex items-center justify-center gap-4 uppercase tracking-widest italic"
              >
                Seal Order <ArrowRight className="w-8 h-8" />
              </button>

              <div className="mt-12 space-y-6">
                <div className="flex items-center gap-5 text-white/50 text-[10px] font-black uppercase tracking-[0.2em]">
                  <ShieldCheck className="w-5 h-5 text-blue-400" strokeWidth={3} />
                  Tier-1 Encryption Guaranteed
                </div>
                <div className="flex items-center gap-5 text-white/50 text-[10px] font-black uppercase tracking-[0.2em]">
                  <Truck className="w-5 h-5 text-blue-400" strokeWidth={3} />
                  Priority 24h Logistics
                </div>
              </div>
            </div>
          </aside>
        </div>

        {recommendations.length > 0 && (
          <section className="mt-32 pt-20 border-t border-gray-100">
            <div className="flex items-center gap-4 mb-16">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="text-white w-6 h-6" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Complete Your <span className="text-blue-600">Curations</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {recommendations.map((product) => (
                <div key={product.id} className="group relative flex flex-col bg-white p-6 rounded-[3rem] border border-gray-50 hover:border-blue-100 transition-all duration-500 hover:shadow-2xl">
                  <div className="aspect-[3/4] overflow-hidden rounded-[2rem] mb-6 shadow-sm">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <h3 className="font-black text-lg text-slate-900 mb-2 line-clamp-1 italic">{product.name}</h3>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-black text-blue-600 tracking-tighter">${product.price.toFixed(2)}</span>
                    <button 
                      onClick={() => onAddToCart(product.id)}
                      className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all active:scale-90 shadow-lg"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CartPage;
