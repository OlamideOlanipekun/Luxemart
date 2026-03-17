
export interface Product {
  id: string;
  name: string;
  category_id: string;
  price: number;
  original_price?: number;
  rating: number;
  reviews_count: number;
  image: string;
  badge?: 'SALE' | 'NEW';
  stock_count?: number;
  is_featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  subtitle: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  stars: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}