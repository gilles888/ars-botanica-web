import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Category, Product, ProductCategory, Testimonial } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = environment.apiUrl;

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

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.api}/products`);
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.api}/products/featured`);
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    return this.http.get<Product>(`${this.api}/products/slug/${slug}`).pipe(
      catchError(() => of(undefined))
    );
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.http.get<Product>(`${this.api}/products/${id}`).pipe(
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
    return this.http.get<Category[]>(`${this.api}/categories`);
  }

  getTestimonials(): Observable<Testimonial[]> {
    return of(this.testimonials);
  }

  searchProducts(query: string): Observable<Product[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Product[]>(`${this.api}/products/search`, { params });
  }

  filterProducts(params: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
  }): Observable<Product[]> {
    let httpParams = new HttpParams();
    if (params.category && params.category !== 'all') {
      httpParams = httpParams.set('category', params.category);
    }
    if (params.minPrice !== undefined) {
      httpParams = httpParams.set('minPrice', params.minPrice.toString());
    }
    if (params.maxPrice !== undefined) {
      httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
    }
    if (params.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
    }
    return this.http.get<Product[]>(`${this.api}/products/filter`, { params: httpParams });
  }
}
