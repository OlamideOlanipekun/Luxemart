
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Truck, RotateCcw, ShieldCheck, Ruler, ArrowLeft } from 'lucide-react';

const PageHero: React.FC<{ title: string; subtitle: string; icon: any }> = ({ title, subtitle, icon: Icon }) => (
  <section className="bg-gray-50 border-b border-gray-100 py-20 md:py-32 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-100/20 blur-[100px] -z-10"></div>
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
          <Icon className="text-white w-8 h-8" />
        </div>
        <div className="h-1 w-20 bg-blue-600 rounded-full hidden md:block"></div>
      </div>
      <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter italic uppercase leading-[0.9] mb-6">
        {title.split(' ').map((word, i) => (
          <span key={i} className={i % 2 !== 0 ? 'text-blue-600' : ''}>{word} </span>
        ))}
      </h1>
      <p className="text-gray-500 text-xl md:text-2xl font-medium max-w-2xl italic">{subtitle}</p>
    </div>
  </section>
);

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white">
      <PageHero 
        title="Direct Support" 
        subtitle="Connect with our global concierge team for sizing advice, order tracking, and curated style recommendations."
        icon={Mail}
      />

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="flex-1 space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900 italic uppercase">Global Headquarters</h2>
              <div className="h-1.5 w-12 bg-blue-600 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Location</div>
                  <div className="text-lg font-bold text-slate-900 italic">123 Fashion Avenue<br />Suite 400, New York, NY 10001</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Telephone</div>
                  <div className="text-lg font-bold text-slate-900 italic">+1 (555) 123-4567<br />Mon-Fri: 9am - 6pm EST</div>
                </div>
              </div>
            </div>

            <div className="aspect-video rounded-[3rem] overflow-hidden bg-gray-100 border border-gray-100 relative shadow-2xl group">
              <img 
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200" 
                alt="Our Office" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[2px]"></div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-gray-50 rounded-[4rem] p-10 md:p-16 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <h3 className="text-3xl font-black text-slate-900 italic uppercase">Message <span className="text-blue-600">Us</span></h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input required type="text" className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold focus:outline-none focus:border-blue-600 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input required type="email" className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold focus:outline-none focus:border-blue-600 transition-all" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Inquiry Subject</label>
                      <select className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold focus:outline-none focus:border-blue-600 transition-all appearance-none">
                        <option>Order Status Inquiry</option>
                        <option>Product Sizing Advice</option>
                        <option>Returns & Exchanges</option>
                        <option>Partnership Opportunities</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Narrative</label>
                      <textarea required rows={5} className="w-full bg-white border-2 border-gray-100 rounded-[2rem] py-4 px-6 font-bold focus:outline-none focus:border-blue-600 transition-all resize-none"></textarea>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xl hover:bg-blue-600 transition-all shadow-3xl flex items-center justify-center gap-4 italic uppercase tracking-widest">
                    Send Inquiry <Send className="w-6 h-6" />
                  </button>
                </form>
              ) : (
                <div className="text-center py-20 space-y-8 animate-fadeInUp">
                  <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/40">
                    <CheckCircle2 className="text-white w-12 h-12" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-black text-slate-900 italic uppercase">Transmitted</h3>
                    <p className="text-gray-500 text-lg font-medium italic">Your message is with our concierge team. Expect a response within 4-6 archival hours.</p>
                  </div>
                  <button onClick={() => setSubmitted(false)} className="text-blue-600 font-black uppercase tracking-widest text-xs hover:text-slate-900 transition-colors">Submit another inquiry</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const ShippingPage: React.FC = () => (
  <div className="bg-white">
    <PageHero 
      title="Global Logistics" 
      subtitle="Excellence in delivery and care. We treat every package as a piece of history."
      icon={Truck}
    />
    <section className="max-w-4xl mx-auto px-4 py-24 space-y-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { icon: Truck, title: "Swift Transit", desc: "4-7 business days worldwide via premium couriers." },
          { icon: RotateCcw, title: "Effortless Return", desc: "30-day window for curated exchanges." },
          { icon: ShieldCheck, title: "Vault Protection", desc: "Every order is fully insured until it reaches you." }
        ].map((item, i) => (
          <div key={i} className="text-center space-y-6">
            <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mx-auto shadow-lg">
              <item.icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tight">{item.title}</h3>
            <p className="text-gray-500 font-medium italic">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-12">
        <h2 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter">Shipping <span className="text-blue-600">Methodology</span></h2>
        <div className="space-y-10">
          {[
            { q: "Do you ship internationally?", a: "LuxeMart operates in 45+ countries. We utilize premium logistics networks like DHL Express and FedEx to ensure your archive reaches you anywhere in the world." },
            { q: "What are the shipping costs?", a: "Complimentary global shipping is standard for all orders over $250. For orders under this threshold, a flat valuation fee of $15 is applied." },
            { q: "How do I return an item?", a: "Initiate a return through your Member Profile. We will provide a pre-paid archival shipping label. Items must be in original, untouched condition with all security tags intact." }
          ].map((faq, i) => (
            <div key={i} className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 group hover:border-blue-600 transition-all">
              <h4 className="text-xl font-black text-slate-900 mb-4 italic tracking-tight">{faq.q}</h4>
              <p className="text-gray-500 leading-relaxed font-medium italic">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export const SizeGuidePage: React.FC = () => (
  <div className="bg-white">
    <PageHero 
      title="Fit Metrics" 
      subtitle="Ensuring the perfect silhouette. Our sizing reflects contemporary architectural fit standards."
      icon={Ruler}
    />
    <section className="max-w-5xl mx-auto px-4 py-24">
      <div className="space-y-24">
        {['Men', 'Women'].map((gender) => (
          <div key={gender} className="space-y-12">
            <h2 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter">{gender}'s <span className="text-blue-600">Sizing</span></h2>
            <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    {['Luxe Size', 'Standard (US)', 'Chest (in)', 'Waist (in)', 'Shoulder (in)'].map(h => (
                      <th key={h} className="p-8 text-[10px] font-black uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-500 font-bold divide-y divide-gray-50">
                  {[
                    ['Archival XS', '34', '33-35', '27-29', '16.5'],
                    ['Archival S', '36', '36-38', '30-32', '17.2'],
                    ['Archival M', '38', '39-41', '33-35', '18.0'],
                    ['Archival L', '40', '42-44', '36-38', '18.8'],
                    ['Archival XL', '42', '45-47', '39-41', '19.5']
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                      {row.map((cell, j) => (
                        <td key={j} className={`p-8 italic ${j === 0 ? 'text-slate-900 font-black' : ''}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <div className="bg-blue-600 p-12 md:p-20 rounded-[5rem] text-white relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h3 className="text-4xl font-black italic tracking-tight uppercase">Custom <br/>Tailoring Advice?</h3>
              <p className="text-blue-100 text-xl font-medium leading-relaxed italic">Our AI Stylist can analyze your measurements and provide a specific size recommendation for any archival piece.</p>
              <button className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 hover:text-white transition-all">Consult Assistant</button>
            </div>
            <div className="w-48 h-48 bg-white/10 backdrop-blur-xl rounded-[3rem] flex items-center justify-center border border-white/20">
              <Ruler className="w-24 h-24 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export const LegalPage: React.FC<{ type: 'privacy' | 'terms' }> = ({ type }) => (
  <div className="bg-white">
    <PageHero 
      title={type === 'privacy' ? "Data Privacy" : "Terms of Service"} 
      subtitle={type === 'privacy' ? "Our commitment to protecting your digital footprint and transactional security." : "The fundamental agreement governing your membership and archival acquisitions."}
      icon={ShieldCheck}
    />
    <section className="max-w-4xl mx-auto px-4 py-24 space-y-16">
      <div className="prose prose-slate prose-lg max-w-none">
        <h2 className="text-3xl font-black text-slate-900 italic uppercase">Archival Foundation</h2>
        <p className="text-gray-500 font-medium leading-relaxed italic text-lg">
          Welcome to the legal framework of LuxeMart. By accessing our archives, you agree to comply with and be bound by the following terms. We take our responsibilities to our members seriously and maintain the highest standards of transparency.
        </p>
        
        <div className="space-y-12 mt-12">
          {[
            { h: "Membership Identity", p: "Every member is responsible for maintaining the confidentiality of their vault access credentials. Acquisitions made through your profile are legally recognized as authorized by the identity holder." },
            { h: "Archival Accuracy", p: "While we strive for perfection, we cannot guarantee that every pixel accurately reflects the true material color. We recommend consulting our AI Stylist for texture and color depth analysis." },
            { h: "Acquisition & Valuation", p: "All prices are listed in USD. Valuation changes may occur between seasonal drops. Once an order is sealed, the valuation at that moment is final and binding." },
            { h: "Digital Footprint Protection", p: "Your data is stored in tier-1 encrypted environments. We do not sell your narrative to third-party entities. We only utilize your metrics to improve your archival experience." }
          ].map((item, i) => (
            <div key={i} className="space-y-4">
              <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tight">{i + 1}. {item.h}</h3>
              <p className="text-gray-500 leading-relaxed font-medium italic">{item.p}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-20 border-t border-gray-100 flex items-center justify-between">
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Effective Date: June 01, 2024</div>
        <button className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors">
          Download PDF Document <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </section>
  </div>
);
