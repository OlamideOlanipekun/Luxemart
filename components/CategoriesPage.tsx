
import React from 'react';
import { ArrowRight, Shirt, Watch, Smartphone, ShoppingBag } from 'lucide-react';
import { CATEGORIES, ALL_PRODUCTS } from '../constants';

interface CategoriesPageProps {
  onCategorySelect: (catId: string) => void;
}

const CategoryIconMap: Record<string, any> = {
  men: Shirt,
  women: ShoppingBag,
  accessories: Watch,
  tech: Smartphone,
};

const CategoriesPage: React.FC<CategoriesPageProps> = ({ onCategorySelect }) => {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Section */}
      <section className="bg-blue-50/50 py-16 md:py-24 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-[100px] -z-10 opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full blur-[80px] -z-10 opacity-50 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 animate-fadeInUp">
            <span>Home</span>
            <span>/</span>
            <span className="text-blue-600 font-medium">Categories</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 animate-fadeInUp [animation-delay:0.1s]">
            Departments
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl leading-relaxed animate-fadeInUp [animation-delay:0.2s]">
            Explore our curated collections across fashion, lifestyle, and technology. Every item hand-picked for quality.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {CATEGORIES.map((category, index) => {
              const Icon = CategoryIconMap[category.id] || ShoppingBag;
              const productCount = ALL_PRODUCTS.filter(p => p.category === category.id).length;

              return (
                <div 
                  key={category.id}
                  onClick={() => onCategorySelect(category.id)}
                  className={`group relative h-[500px] rounded-[3rem] overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-700 animate-fadeInUp`}
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-blue-900/40 transition-all duration-500"></div>
                  
                  {/* Category Content */}
                  <div className="absolute inset-0 p-10 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <Icon className="text-white w-8 h-8" />
                      </div>
                      <div className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                        {productCount}+ Items
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white text-sm font-semibold tracking-wide">
                        {category.subtitle}
                      </div>
                      <div className="flex items-center justify-between">
                        <h2 className="text-4xl md:text-5xl font-black text-white">
                          {category.name}
                        </h2>
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-slate-900 transform translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 shadow-xl">
                          <ArrowRight className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Micro Interaction Bottom Bar */}
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gray-50 py-20 mx-4 md:mx-8 rounded-[4rem]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h3 className="text-3xl font-extrabold text-slate-900">Cant find what you're looking for?</h3>
          <p className="text-gray-500 text-lg">Our AI Stylist is always ready to help you find the perfect match.</p>
          <button 
            onClick={() => onCategorySelect('')}
            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all hover:scale-105 shadow-xl"
          >
            Browse All Products
          </button>
        </div>
      </section>
    </div>
  );
};

export default CategoriesPage;
