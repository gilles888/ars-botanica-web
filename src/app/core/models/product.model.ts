export type ProductSize = 'PETIT' | 'MOYEN' | 'GRAND';

export interface ProductVariant {
  id: number;
  size: ProductSize;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  variants: ProductVariant[];
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
  // Champs multilingues optionnels (EN / NL)
  nameEn?: string;
  nameNl?: string;
  shortDescriptionEn?: string;
  shortDescriptionNl?: string;
  descriptionEn?: string;
  descriptionNl?: string;
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

export function getStartingPrice(product: Product): number {
  if (!product.variants?.length) return 0;
  const petit = product.variants.find(v => v.size === 'PETIT');
  return petit?.price ?? product.variants[0].price;
}

export function getVariantPrice(product: Product, size: ProductSize): number {
  return product.variants?.find(v => v.size === size)?.price ?? 0;
}

/**
 * Retourne la valeur localisée d'un champ texte du produit.
 * Si la traduction pour la langue demandée est absente, retourne la valeur FR par défaut.
 */
export function localizedField(product: Product, field: 'name' | 'shortDescription' | 'description', lang: string): string {
  if (lang === 'en') {
    const key = (field + 'En') as keyof Product;
    return (product[key] as string) || (product[field] as string);
  }
  if (lang === 'nl') {
    const key = (field + 'Nl') as keyof Product;
    return (product[key] as string) || (product[field] as string);
  }
  return (product[field] as string) || '';
}
