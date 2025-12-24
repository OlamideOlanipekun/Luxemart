
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../constants';

interface CategoriesProps {
  onCategoryClick?: (catId: string) => void;
  onViewAll?: () => void;
}

const Categories: React.FC<CategoriesProps> = ({ onCategoryClick, onViewAll }) => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Shop by Category</h2>
            <div className="h-1.5 w-20 bg-blue-600 rounded-full"></div>
          </div>
          <button 
            onClick={onViewAll}
            className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all group"
          >
            View All Categories <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => onCategoryClick?.(category.id)}
              className="group relative h-[400px] overflow-hidden rounded-[2rem] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors"></div>
              
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-white text-3xl font-bold mb-1">{category.name}</h3>
                <p className="text-white/80 text-sm mb-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {category.subtitle}
                </p>
                <div className="h-0.5 w-0 bg-white group-hover:w-full transition-all duration-500 rounded-full opacity-50"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
