export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: ProductCategory;
  tags: string[];
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isFeatured: boolean;
  isSeasonal: boolean;
  inStock: boolean;
  occasion?: string[];
  colors?: string[];
}

export type ProductCategory =
  | 'bouquets'
  | 'compositions'
  | 'plantes'
  | 'mariages'
  | 'deuil'
  | 'seasonal';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  productCount: number;
}

export interface Testimonial {
  id: number;
  name: string;
  avatar?: string;
  rating: number;
  comment: string;
  occasion: string;
  date: string;
}
