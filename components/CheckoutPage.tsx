import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { 
  ShieldCheck, 
  Lock, 
  ChevronLeft, 
  ChevronRight, 
  Truck, 
  CreditCard, 
  CheckCircle2,
  Package,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { Product, CartItem } from '../types';
import { api } from '../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface CheckoutPageProps {
  products: Product[];
  cart: CartItem[];
  onBack: () => void;
  onSuccess: (orderNumber: string) => void;
}

const CheckoutForm: React.FC<{ 
  total: number; 
  shippingData: any; 
  onSuccess: (orderNum: string) => void;
  onBack: () => void;
}> = ({ total, shippingData, onSuccess, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const getSecret = async () => {
      try {
        const { clientSecret } = await api.payments.createIntent(total);
        setClientSecret(clientSecret);
      } catch (err: any) {
        setError(err.message);
      }
    };
    getSecret();
  }, [total]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
        billing_details: {
          name: shippingData.name,
          email: shippingData.email,
          address: {
            line1: shippingData.address,
            city: shippingData.city,
            postal_code: shippingData.zip,
          }
        },
      },
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      // Finalize order on backend
      try {
        const orderData = await api.orders.create();
        onSuccess(orderData.orderNumber);
      } catch (err: any) {
        setError("Payment succeeded but order creation failed. Please contact support.");
        setProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
          Card Curation
        </label>
        <div className="p-6 bg-slate-900/5 rounded-2xl border border-slate-900/10 focus-within:border-blue-600 transition-colors">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#0f172a',
                  '::placeholder': {
                    color: '#94a3b8',
                  },
                  fontFamily: 'Outfit, sans-serif',
                },
                invalid: {
                  color: '#ef4444',
                },
              },
            }}
          />
        </div>
        {error && (
          <div className="mt-6 text-red-500 text-sm font-bold bg-red-50 p-4 rounded-xl border border-red-100 animate-shake">
            {error}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={processing}
          className="flex-1 px-8 py-6 rounded-3xl font-black text-slate-600 hover:bg-slate-50 transition-all border-2 border-slate-100 flex items-center justify-center gap-3 uppercase tracking-widest"
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <button
          disabled={!stripe || processing || !clientSecret}
          className="flex-[2] bg-blue-600 text-white px-8 py-6 rounded-3xl font-black text-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-4 uppercase tracking-widest italic disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {processing ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Authorize Payment <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <ShieldCheck className="w-4 h-4 text-green-500" />
        Tier-1 Secure Transaction
      </div>
    </form>
  );
};

const CheckoutPage: React.FC<CheckoutPageProps> = ({ products, cart, onBack, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...product, ...item };
  }).filter(item => item.id);

  const subtotal = cartItems.reduce((acc, item) => acc + ((item.price || 0) * item.quantity), 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const isShippingValid = shippingData.name && shippingData.email && shippingData.address && shippingData.city && shippingData.zip;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-40">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-20">
          <button 
            onClick={onBack}
            className="group flex items-center gap-3 text-slate-400 hover:text-blue-600 font-black uppercase tracking-widest text-xs transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Archive
          </button>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 italic tracking-tighter">
            Checkout <span className="text-blue-600">Protocol</span>
          </h1>
          <p className="text-slate-500 mt-4 text-xl font-medium max-w-2xl">
            Securely finalizing your selection of signature pieces from the LuxeMart vault.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-20">
          <div className="flex-1">
            {/* Steps Progress */}
            <div className="flex items-center gap-4 mb-16 overflow-x-auto pb-4 no-scrollbar">
              {[
                { n: 1, label: 'Shipping curate', icon: Truck },
                { n: 2, label: 'Payment gateway', icon: CreditCard },
                { n: 3, label: 'Verification', icon: CheckCircle2 }
              ].map((s) => (
                <div key={s.n} className="flex items-center shrink-0">
                  <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl border-2 transition-all duration-500 ${
                    step >= s.n ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-200 bg-white text-slate-400'
                  }`}>
                    <s.icon className="w-5 h-5 font-black" />
                    <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">{s.label}</span>
                  </div>
                  {s.n < 3 && <div className={`w-12 h-[2px] mx-2 ${step > s.n ? 'bg-blue-600' : 'bg-slate-200'}`} />}
                </div>
              ))}
            </div>

            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Identity</label>
                    <input 
                      name="name"
                      placeholder="Alexander Luxe"
                      value={shippingData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white border-2 border-slate-100 rounded-3xl p-6 font-bold focus:border-blue-600 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
                    <input 
                      name="email"
                      type="email"
                      placeholder="alex@luxemart.com"
                      value={shippingData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white border-2 border-slate-100 rounded-3xl p-6 font-bold focus:border-blue-600 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Curation Destination (Address)</label>
                    <input 
                      name="address"
                      placeholder="123 Signature Way"
                      value={shippingData.address}
                      onChange={handleInputChange}
                      className="w-full bg-white border-2 border-slate-100 rounded-3xl p-6 font-bold focus:border-blue-600 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">City</label>
                    <input 
                      name="city"
                      placeholder="Luxe City"
                      value={shippingData.city}
                      onChange={handleInputChange}
                      className="w-full bg-white border-2 border-slate-100 rounded-3xl p-6 font-bold focus:border-blue-600 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Zip Code</label>
                    <input 
                      name="zip"
                      placeholder="90210"
                      value={shippingData.zip}
                      onChange={handleInputChange}
                      className="w-full bg-white border-2 border-slate-100 rounded-3xl p-6 font-bold focus:border-blue-600 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>
                <button 
                  onClick={() => setStep(2)}
                  disabled={!isShippingValid}
                  className="w-full bg-slate-900 text-white p-6 rounded-3xl font-black text-xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-4 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed italic"
                >
                  Proceed to Payment <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Elements stripe={stripePromise}>
                  <CheckoutForm 
                    total={total} 
                    shippingData={shippingData} 
                    onSuccess={onSuccess}
                    onBack={() => setStep(1)}
                  />
                </Elements>
              </div>
            )}
          </div>

          {/* Right Sidebar: Order Summary */}
          <aside className="w-full lg:w-[450px]">
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 border border-slate-100 shadow-2xl sticky top-32 overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[100px] -z-10 opacity-30"></div>
              
              <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter mb-10 pb-6 border-b border-slate-50 uppercase">
                Order <span className="text-blue-600 underline decoration-2 underline-offset-8">Insight</span>
              </h2>

              <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-6 items-center">
                    <div className="w-20 h-24 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-900 text-sm line-clamp-1 italic">{item.name}</h4>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">QTY: {item.quantity}</p>
                    </div>
                    <div className="text-slate-900 font-black">${((item.price || 0) * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-6 pt-10 border-t border-slate-50">
                <div className="flex justify-between items-center text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                  <span>Subtotal Aggregate</span>
                  <span className="text-slate-900 font-black text-base">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                  <span>Logistics</span>
                  <span className={`font-black text-base ${shipping === 0 ? 'text-green-500' : 'text-slate-900'}`}>
                    {shipping === 0 ? 'COMPLIMENTARY' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                  <span>Estimated Tax</span>
                  <span className="text-slate-900 font-black text-base">${tax.toFixed(2)}</span>
                </div>
                <div className="pt-8 border-t border-slate-50 flex justify-between items-end">
                  <span className="text-slate-400 font-black uppercase tracking-widest text-xs">Total Valuation</span>
                  <span className="text-5xl font-black text-slate-900 italic tracking-tighter transition-all group-hover:text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-12 space-y-4">
                <div className="flex items-center gap-4 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                  <Package className="w-4 h-4 text-blue-600" />
                  White-glove logistics curation
                </div>
                <div className="flex items-center gap-4 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                  <Lock className="w-4 h-4 text-blue-600" />
                  Tier-1 Encryption Shield
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
