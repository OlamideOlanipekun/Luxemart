
import { Product, Category, Testimonial } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'men',
    name: 'Men',
    subtitle: 'New arrivals & trends',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'women',
    name: 'Women',
    subtitle: 'Summer collection',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    subtitle: 'Watches & Jewelry',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'tech',
    name: 'Tech',
    subtitle: 'Smart devices',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800'
  }
];

export const PHILOSOPHY = [
  {
    title: "Timeless Quality",
    description: "Every piece is selected for its archival potential—items that transcend seasonal trends.",
    icon: "Sparkles"
  },
  {
    title: "Ethical Sourcing",
    description: "We partner exclusively with workshops that prioritize human dignity and environmental health.",
    icon: "Shield"
  },
  {
    title: "Modern Utility",
    description: "High-end design meets the practical demands of a contemporary lifestyle.",
    icon: "Globe"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: 'Creative Director',
    content: 'The quality of the archival pieces I received exceeded every expectation. LuxeMart is truly in a league of its own.',
    avatar: 'https://i.pravatar.cc/100?u=sarah',
    stars: 5
  },
  {
    id: '2',
    name: 'David Chen',
    role: 'Tech Entrepreneur',
    content: 'Finally, an e-commerce platform that understands the intersection of high-end fashion and functional technology.',
    avatar: 'https://i.pravatar.cc/100?u=david',
    stars: 5
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    role: 'Professional Stylist',
    content: 'The AI Stylist is remarkably accurate. It helped me curate a seasonal wardrobe that feels uniquely personal.',
    avatar: 'https://i.pravatar.cc/100?u=elena',
    stars: 5
  }
];

export const SOCIAL_FEED = [
  "https://images.unsplash.com/photo-1488161628813-244768e7d66f?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=400"
];

export const BEST_SELLERS: Product[] = [
  {
    id: '1',
    name: 'Classic Trench Coat',
    category: 'women',
    price: 129.00,
    originalPrice: 159.00,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600',
    badge: 'SALE',
    stockCount: 45
  },
  {
    id: '2',
    name: 'Sport Runner X',
    category: 'men',
    price: 85.00,
    rating: 4.9,
    reviews: 86,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    stockCount: 3
  },
  {
    id: '3',
    name: 'Premium Leather Bag',
    category: 'accessories',
    price: 210.00,
    rating: 5.0,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600',
    badge: 'NEW',
    stockCount: 12
  },
  {
    id: '4',
    name: 'Aviator Sunglasses',
    category: 'accessories',
    price: 145.00,
    rating: 4.7,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1511499767390-a73c23310ce1?auto=format&fit=crop&q=80&w=600',
    stockCount: 0
  }
];

export const ALL_PRODUCTS: Product[] = [
  ...BEST_SELLERS,
  {
    id: '5',
    name: 'Silk Evening Dress',
    price: 249.00,
    originalPrice: 299.00,
    rating: 4.9,
    reviews: 31,
    category: 'women',
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e62f85452?auto=format&fit=crop&q=80&w=600',
    stockCount: 8
  },
  {
    id: '6',
    name: 'Minimalist Watch',
    price: 149.00,
    originalPrice: 189.00,
    rating: 4.6,
    reviews: 154,
    category: 'accessories',
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600',
    stockCount: 22
  },
  {
    id: '7',
    name: 'Smart Noise Cancelling Headphones',
    price: 279.00,
    originalPrice: 399.00,
    rating: 4.9,
    reviews: 2100,
    category: 'tech',
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
    stockCount: 150
  },
  {
    id: '8',
    name: 'Linen Button-Down',
    price: 45.00,
    originalPrice: 65.00,
    rating: 4.5,
    reviews: 89,
    category: 'men',
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1596755094514-f87034a2612d?auto=format&fit=crop&q=80&w=600',
    stockCount: 5
  },
  {
    id: '9',
    name: 'Leather Weekend Bag',
    price: 380.00,
    originalPrice: 450.00,
    rating: 5.0,
    reviews: 12,
    category: 'accessories',
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
    stockCount: 2
  },
  {
    id: '10',
    name: 'Mechanical Keyboard Pro',
    price: 129.00,
    originalPrice: 159.00,
    rating: 4.8,
    reviews: 432,
    category: 'tech',
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=600',
    stockCount: 15
  },
  {
    id: '11',
    name: 'Denim Jacket',
    price: 75.00,
    originalPrice: 95.00,
    rating: 4.4,
    reviews: 210,
    category: 'men',
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=600',
    stockCount: 12
  },
  {
    id: '12',
    name: 'Cashmere Scarf',
    price: 89.00,
    originalPrice: 120.00,
    rating: 4.9,
    reviews: 56,
    category: 'accessories',
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=600',
    stockCount: 30
  },
  {
    id: '13',
    name: 'Designer Tote Bag',
    price: 499.00,
    originalPrice: 750.00,
    rating: 4.8,
    reviews: 88,
    category: 'accessories',
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600',
    stockCount: 0
  },
  {
    id: '14',
    name: 'Smart Watch Series 5',
    price: 199.00,
    originalPrice: 299.00,
    rating: 4.7,
    reviews: 1240,
    category: 'tech',
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1544117518-30dd5978bbbe?auto=format&fit=crop&q=80&w=600',
    stockCount: 65
  },
  {
    id: '15',
    name: 'Slim Fit Summer Blazer',
    price: 139.00,
    originalPrice: 210.00,
    rating: 4.6,
    reviews: 54,
    category: 'men',
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
    stockCount: 4
  },
  {
    id: '16',
    name: 'Floral Maxi Dress',
    price: 69.00,
    originalPrice: 110.00,
    rating: 4.5,
    reviews: 92,
    category: 'women',
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600',
    stockCount: 18
  },
  {
    id: '17',
    name: 'Wireless Charging Hub',
    price: 35.00,
    originalPrice: 59.00,
    rating: 4.9,
    reviews: 310,
    category: 'tech',
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1586816829396-986dc5749774?auto=format&fit=crop&q=80&w=600',
    stockCount: 88
  }
];
