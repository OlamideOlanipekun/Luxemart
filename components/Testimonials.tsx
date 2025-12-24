
import React from 'react';
import { Star } from 'lucide-react';
import { TESTIMONIALS } from '../constants';

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-blue-50/50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900">What Our Customers Say</h2>
          <div className="h-1.5 w-20 bg-blue-600 rounded-full mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50 flex flex-col h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-gray-600 italic text-lg leading-relaxed flex-1 mb-8">
                {testimonial.content}
              </blockquote>

              <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-2 border-blue-50"
                />
                <div>
                  <div className="font-bold text-slate-900">{testimonial.name}</div>
                  <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
