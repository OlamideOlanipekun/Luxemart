
import React from 'react';
import { Globe, Shield, Sparkles, Leaf, Users, Award, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (view: any) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white min-h-screen pb-20 overflow-hidden">
      {/* Editorial Hero */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
            alt="LuxeMart Corporate Culture" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full text-center md:text-left">
          <div className="inline-block px-4 py-1 bg-blue-600/20 border border-blue-400/30 rounded-full text-blue-400 text-xs font-black uppercase tracking-[0.3em] mb-8 animate-fadeInUp">
            Our Legacy
          </div>
          <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.9] tracking-tighter mb-10 animate-fadeInUp italic">
            DEFINING <br/>THE <span className="text-blue-500">ESSENTIAL</span>
          </h1>
          <p className="text-gray-300 text-xl md:text-2xl max-w-2xl font-medium leading-relaxed animate-fadeInUp [animation-delay:0.2s]">
            We believe that premium design should be accessible, quality should be non-negotiable, and style should be timeless.
          </p>
        </div>
      </section>

      {/* Brand Stats Bar */}
      <section className="bg-white relative z-20 -mt-20 max-w-5xl mx-auto px-4">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Founded', value: '2018' },
            { label: 'Countries', value: '45+' },
            { label: 'Designers', value: '12' },
            { label: 'Products', value: '2k+' }
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-4xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{stat.value}</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-32 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-24">
          <div className="flex-1 space-y-10">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight italic">
              A Vision of <span className="text-blue-600">Modernity</span>
            </h2>
            <div className="h-1.5 w-24 bg-blue-600 rounded-full"></div>
            <p className="text-gray-500 text-xl leading-relaxed font-medium">
              Born in the heart of the digital era, LuxeMart started with a simple question: Why must quality be synonymous with exclusivity? 
            </p>
            <p className="text-gray-500 text-lg leading-relaxed">
              Our founders envisioned a platform where craftsmanship from across the globe could meet the modern consumer. We've spent the last six years building a network of ethical manufacturers, master designers, and tech pioneers to curate a collection that speaks to the elite professional.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-100">
                <img src="https://i.pravatar.cc/100?u=ceo" alt="CEO" />
              </div>
              <div>
                <div className="font-black text-slate-900">Julian Sterling</div>
                <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">Founder & CEO</div>
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=600" className="rounded-[2.5rem] shadow-xl translate-y-12" alt="Process" />
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600" className="rounded-[2.5rem] shadow-xl" alt="Retail" />
            </div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-blue-600 rounded-[2.5rem] flex flex-col items-center justify-center text-white p-6 shadow-2xl">
              <Award className="w-10 h-10 mb-2" />
              <span className="text-[10px] font-black uppercase text-center leading-tight">Best in Design 2023</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="bg-gray-50 py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 italic">The Luxe <span className="text-blue-600">Standard</span></h2>
            <p className="text-gray-500 text-xl font-medium uppercase tracking-[0.2em] max-w-xl mx-auto">Foundational principles that guide every decision.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: Shield, 
                title: 'Uncompromising Quality', 
                desc: 'Every item in our collection undergoes a 24-point inspection process before it reaches your door.' 
              },
              { 
                icon: Leaf, 
                title: 'Sustainable Future', 
                desc: 'We are committed to reducing our carbon footprint by 50% by 2026 through renewable packaging.' 
              },
              { 
                icon: Users, 
                title: 'Global Community', 
                desc: 'Supporting local artisans and ethical workshops in 15 countries across Europe and Asia.' 
              }
            ].map((value, i) => (
              <div key={i} className="bg-white p-12 rounded-[4rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 group">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <value.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6 italic">{value.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-slate-900 -z-10 rounded-l-[10rem] hidden lg:block"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center gap-24">
          <div className="flex-1">
             <img 
               src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200" 
               alt="Design Ethics" 
               className="rounded-[5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]"
             />
          </div>
          <div className="flex-1 space-y-12 text-center lg:text-left">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 lg:text-white tracking-tight italic">
              Archival <span className="text-blue-500">Design</span> Philosophy
            </h2>
            <p className="text-gray-500 lg:text-gray-400 text-xl leading-relaxed font-medium italic">
              "Style is not about the new. It's about the permanent."
            </p>
            <p className="text-gray-500 lg:text-gray-400 text-lg leading-relaxed">
              We move against the grain of fast fashion. Our pieces are designed to be part of your archival rotation—items that look as good today as they will in a decade. We source only high-density fabrics, premium aerospace-grade metals, and sustainably-harvested materials.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div className="bg-blue-600/10 p-6 rounded-3xl border border-blue-500/20">
                <Sparkles className="text-blue-500 w-8 h-8 mb-3" />
                <div className="text-slate-900 lg:text-white font-black uppercase text-xs tracking-widest">Timelessness</div>
              </div>
              <div className="bg-blue-600/10 p-6 rounded-3xl border border-blue-500/20">
                <Globe className="text-blue-500 w-8 h-8 mb-3" />
                <div className="text-slate-900 lg:text-white font-black uppercase text-xs tracking-widest">Impact</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join The Journey CTA */}
      <section className="bg-blue-600 py-32 mx-4 md:mx-12 rounded-[5rem] text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-8 space-y-10">
          <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter">Ready to <br/><span className="text-slate-900">Elevate?</span></h2>
          <p className="text-blue-100 text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
            Join 500,000+ members who prioritize quality above all else. Welcome to the future of retail.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <button 
              onClick={() => onNavigate('auth')}
              className="bg-white text-blue-600 px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-slate-900 hover:text-white transition-all hover:scale-105 shadow-2xl flex items-center justify-center gap-3"
            >
              Join Membership <ArrowRight className="w-6 h-6" />
            </button>
            <button 
              onClick={() => onNavigate('contact')}
              className="bg-blue-500/40 backdrop-blur-md border border-white/20 text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-white hover:text-blue-600 transition-all"
            >
              Explore Careers
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
