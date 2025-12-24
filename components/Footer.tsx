
import React from 'react';
import { ShoppingCart, Facebook, Twitter, Instagram, MapPin, Phone, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: any) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="space-y-6">
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => onNavigate('home')}
            >
              <div className="bg-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                <ShoppingCart className="text-white w-5 h-5" fill="currentColor" />
              </div>
              <span className="font-black text-2xl tracking-tight italic">LuxeMart</span>
            </div>
            <p className="text-gray-500 leading-relaxed font-medium italic">
              Your premium destination for fashion, tech, and lifestyle essentials. Curated for quality and style.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all hover:border-blue-600">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-black text-[10px] text-slate-900 mb-8 uppercase tracking-[0.3em]">Shop Collection</h4>
            <ul className="space-y-4">
              {[
                { label: 'New Arrivals', id: 'shop' },
                { label: 'Best Sellers', id: 'home' },
                { label: 'Men', id: 'shop' },
                { label: 'Women', id: 'shop' },
                { label: 'Accessories', id: 'shop' }
              ].map((item) => (
                <li key={item.label}>
                  <button 
                    onClick={() => onNavigate(item.id)}
                    className="text-gray-500 hover:text-blue-600 transition-colors font-bold text-sm italic"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-black text-[10px] text-slate-900 mb-8 uppercase tracking-[0.3em]">Member Services</h4>
            <ul className="space-y-4">
              {[
                { label: 'Help Center', id: 'contact' },
                { label: 'Order Status', id: 'auth' },
                { label: 'Shipping & Returns', id: 'shipping' },
                { label: 'Size Guide', id: 'size-guide' },
                { label: 'Contact Us', id: 'contact' }
              ].map((item) => (
                <li key={item.label}>
                  <button 
                    onClick={() => onNavigate(item.id)}
                    className="text-gray-500 hover:text-blue-600 transition-colors font-bold text-sm italic"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black text-[10px] text-slate-900 mb-8 uppercase tracking-[0.3em]">Direct Inquiries</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 text-gray-500">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                <span className="font-bold text-sm leading-relaxed italic">123 Fashion Ave, Suite 400<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-4 text-gray-500">
                <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="font-bold text-sm italic">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-4 text-gray-500">
                <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="font-bold text-sm underline hover:text-blue-600 transition-colors italic">support@luxemart.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <button onClick={() => onNavigate('privacy')} className="hover:text-blue-600 transition-colors">Privacy Policy</button>
            <button onClick={() => onNavigate('terms')} className="hover:text-blue-600 transition-colors">Terms of Service</button>
            <span>© 2024 LuxeMart. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            {['VISA', 'MC', 'AMEX', 'PP'].map((card) => (
              <div key={card} className="px-3 py-1 border border-gray-100 rounded text-[10px] font-black text-gray-300">
                {card}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
