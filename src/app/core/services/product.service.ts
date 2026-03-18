import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Category, Product, ProductCategory, ProductSize, ProductVariant, Testimonial } from '../models/product.model';
import { ProduitsService, CatgoriesService, ProductResponse, CategoryResponse } from '@core/api/generated';

@Injectable({ providedIn: 'root' })
export class ProductService {
  // Fallback testimonials (not from API)
  private testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sophie M.',
      rating: 5,
      comment: 'Le bouquet pour mon mariage était absolument magnifique. Marie a su capturer exactement ce que je voulais — élégant, naturel, inoubliable.',
      occasion: 'Mariage',
      date: 'Octobre 2024'
    },
    {
      id: 2,
      name: 'Pierre L.',
      rating: 5,
      comment: 'J\'ai commandé une composition pour l\'anniversaire de ma femme. Elle a été bouleversée par la beauté et l\'attention aux détails. Merci Ars Botanica !',
      occasion: 'Anniversaire',
      date: 'Septembre 2024'
    },
    {
      id: 3,
      name: 'Camille B.',
      rating: 4,
      comment: 'Service impeccable et fleurs d\'une fraîcheur remarquable. Mes succulentes sont toujours aussi belles 3 mois après !',
      occasion: 'Décoration',
      date: 'Juillet 2024'
    },
    {
      id: 4,
      name: 'Antoine R.',
      rating: 5,
      comment: 'Une boutique authentique avec une équipe passionnée. Je recommande les couronnes séchées — elles durent des mois et sentent divinement bon.',
      occasion: 'Cadeau',
      date: 'Août 2024'
    }
  ];

  constructor(
    private produitsService: ProduitsService,
    private catgoriesService: CatgoriesService
  ) {}

  getProducts(): Observable<Product[]> {
    return this.produitsService.getAll1().pipe(
      map(products => products.map(p => this.mapToProduct(p)))
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.produitsService.getFeatured().pipe(
      map(products => products.map(p => this.mapToProduct(p)))
    );
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    return this.produitsService.getBySlug(slug).pipe(
      map(p => this.mapToProduct(p)),
      catchError(() => of(undefined))
    );
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.produitsService.getById1(id).pipe(
      map(p => this.mapToProduct(p)),
      catchError(() => of(undefined))
    );
  }

  getProductsByCategory(category: ProductCategory): Observable<Product[]> {
    return this.filterProducts({ category });
  }

  getRelatedProducts(product: Product): Observable<Product[]> {
    return this.filterProducts({ category: product.category }).pipe(
      map(products => products.filter(p => p.id !== product.id).slice(0, 4))
    );
  }

  getCategories(): Observable<Category[]> {
    return this.catgoriesService.getAll3().pipe(
      map(categories => categories.map(c => this.mapToCategory(c)))
    );
  }

  getTestimonials(): Observable<Testimonial[]> {
    return of(this.testimonials);
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.produitsService.search(query).pipe(
      map(products => products.map(p => this.mapToProduct(p)))
    );
  }

  filterProducts(params: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
  }): Observable<Product[]> {
    const category = params.category && params.category !== 'all'
      ? params.category.toUpperCase() as 'BOUQUETS' | 'COMPOSITIONS' | 'PLANTES' | 'MARIAGES' | 'DEUIL' | 'SEASONAL'
      : undefined;
    return this.produitsService.filter(category, params.minPrice, params.maxPrice).pipe(
      map(products => products.map(p => this.mapToProduct(p)))
    );
  }

  private mapToProduct(p: ProductResponse): Product {
    return {
      id: p.id ?? 0,
      name: p.name ?? '',
      slug: p.slug ?? '',
      description: p.description ?? '',
      shortDescription: p.shortDescription ?? '',
      variants: (p.variants ?? []).map(v => ({
        id: v.id!,
        size: v.size as ProductSize,
        price: Number(v.price)
      })) as ProductVariant[],
      images: p.images ?? [],
      category: (p.category?.toLowerCase() ?? '') as ProductCategory,
      tags: p.tags ?? [],
      rating: p.rating ?? 0,
      reviewCount: p.reviewCount ?? 0,
      isNew: p.isNew ?? false,
      isFeatured: p.isFeatured ?? false,
      isSeasonal: p.isSeasonal ?? false,
      inStock: p.inStock ?? true,
    };
  }

  private mapToCategory(c: CategoryResponse): Category {
    return {
      id: c.id ?? '',
      name: c.name ?? '',
      slug: c.slug ?? '',
      description: c.description ?? '',
      icon: c.icon ?? '',
      image: c.image ?? '',
      productCount: c.productCount ?? 0,
    };
  }
}
