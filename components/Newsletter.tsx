
import React from 'react';

interface NewsletterProps {
  onPrivacyClick: () => void;
}

const Newsletter: React.FC<NewsletterProps> = ({ onPrivacyClick }) => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
        <div className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-wider uppercase">
          Newsletter
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">Subscribe & Get 10% Off</h2>
        <p className="text-gray-500 text-lg md:text-xl leading-relaxed">
          Join our email list to receive exclusive offers, new product announcements, and style tips directly to your inbox.
        </p>
        
        <form className="flex flex-col sm:flex-row items-center gap-4 mt-8" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
          />
          <button className="w-full sm:w-auto bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 whitespace-nowrap">
            Subscribe
          </button>
        </form>
        
        <p className="text-xs text-gray-400">
          We care about your data. Read our <button onClick={onPrivacyClick} className="underline hover:text-blue-600 transition-colors">Privacy Policy</button>.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
