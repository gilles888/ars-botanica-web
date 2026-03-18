import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../core/services/product.service';
import { Product, Category, Testimonial } from '../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, RouterLink, CarouselModule, CardModule,
    ButtonModule, RatingModule, TagModule, BadgeModule, FormsModule,
    TranslateModule
  ],
  template: `
    <div class="page-enter">

      <!-- ── HERO ────────────────────────────────────────────────── -->
      <section class="relative min-h-screen flex items-center overflow-hidden bg-hero-pattern">
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-rose-pastel/10 blur-3xl"></div>
          <div class="absolute bottom-10 -left-20 w-80 h-80 rounded-full bg-primary-500/10 blur-3xl"></div>
        </div>

        <div class="container-custom relative z-10 pt-20 pb-16">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div class="text-left">
              <p class="text-primary-green uppercase tracking-widest text-sm font-semibold mb-4 flex items-center gap-2">
                <span class="w-8 h-0.5 bg-primary-green inline-block"></span>
                {{ 'home.hero_eyebrow' | translate }}
              </p>
              <h1 class="font-heading text-5xl lg:text-6xl xl:text-7xl font-bold text-charcoal leading-tight mb-6">
                {{ 'home.hero_h1_line1' | translate }}<br>
                <span class="text-primary-green italic">{{ 'home.hero_h1_line2' | translate }}</span><br>
                {{ 'home.hero_h1_line3' | translate }}
              </h1>
              <p class="text-lg text-gray-500 mb-10 max-w-md leading-relaxed">
                {{ 'home.hero_desc' | translate }}
              </p>
              <div class="flex flex-wrap gap-4">
                <a routerLink="/boutique">
                  <button pButton
                    [label]="'home.hero_cta_shop' | translate"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.85rem 2rem; font-size: 1rem;">
                  </button>
                </a>
                <a routerLink="/a-propos">
                  <button pButton
                    [label]="'home.hero_cta_about' | translate"
                    class="p-button-outlined"
                    style="border-color: #5a8a4a; color: #5a8a4a; border-radius: 2rem; padding: 0.85rem 2rem; font-size: 1rem;">
                  </button>
                </a>
              </div>

              <div class="flex gap-10 mt-14 pt-10 border-t border-gray-200">
                <div *ngFor="let stat of stats">
                  <div class="font-heading text-3xl font-bold text-primary-green">{{ stat.value }}</div>
                  <div class="text-sm text-gray-500">{{ stat.labelKey | translate }}</div>
                </div>
              </div>
            </div>

            <!-- Hero image -->
            <div class="relative hidden lg:block">
              <div class="relative rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=700&q=85"
                  alt="Bouquet Ars Botanica"
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div class="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-rose-pastel/20 flex items-center justify-center">
                  <i class="pi pi-star-fill text-rose-pastel text-lg"></i>
                </div>
                <div>
                  <p class="font-semibold text-charcoal text-sm">4.9/5</p>
                  <p class="text-xs text-gray-500">{{ 'home.hero_badge_reviews' | translate }}</p>
                </div>
              </div>
              <div class="absolute top-6 -right-6 bg-primary-green text-white rounded-2xl shadow-xl p-4">
                <p class="text-xs font-semibold uppercase tracking-wider opacity-80">{{ 'home.hero_collection' | translate }}</p>
                <p class="font-heading text-lg font-bold">{{ 'home.hero_season' | translate }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── CATEGORIES ──────────────────────────────────────────── -->
      <section class="section-padding bg-white">
        <div class="container-custom">
          <div class="text-center mb-14">
            <p class="text-rose-accent uppercase tracking-widest text-sm font-semibold mb-3">{{ 'home.categories_eyebrow' | translate }}</p>
            <h2 class="font-heading text-4xl text-charcoal mb-4">{{ 'home.categories_title' | translate }}</h2>
            <p class="text-gray-500 max-w-xl mx-auto">{{ 'home.categories_desc' | translate }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <a *ngFor="let cat of categories"
              [routerLink]="['/boutique']"
              [queryParams]="{categorie: cat.slug}"
              class="group block rounded-2xl overflow-hidden relative aspect-[3/4] shadow-md hover:shadow-xl transition-all duration-300">
              <img [src]="cat.image" [alt]="cat.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-5">
                <h3 class="font-heading text-xl text-white font-semibold">{{ cat.name }}</h3>
                <p class="text-white/80 text-xs mt-1">{{ cat.productCount }} {{ 'home.creations_count' | translate }}</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <!-- ── FEATURED PRODUCTS ───────────────────────────────────── -->
      <section class="section-padding bg-cream">
        <div class="container-custom">
          <div class="flex items-end justify-between mb-14">
            <div>
              <p class="text-primary-green uppercase tracking-widest text-sm font-semibold mb-3">{{ 'home.featured_eyebrow' | translate }}</p>
              <h2 class="font-heading text-4xl text-charcoal">{{ 'home.featured_title' | translate }}</h2>
            </div>
            <a routerLink="/boutique"
              class="hidden sm:flex items-center gap-2 text-primary-green font-medium hover:gap-3 transition-all text-sm">
              {{ 'home.featured_see_all' | translate }} <i class="pi pi-arrow-right"></i>
            </a>
          </div>

          <p-carousel
            [value]="featuredProducts"
            [numVisible]="3"
            [numScroll]="1"
            [circular]="true"
            [autoplayInterval]="4000"
            [responsiveOptions]="carouselOptions"
          >
            <ng-template pTemplate="item" let-product>
              <div class="p-3">
                <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  [routerLink]="['/boutique', product.slug]">
                  <div class="relative overflow-hidden aspect-[4/3]">
                    <img [src]="product.images[0]" [alt]="product.name"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div class="absolute top-3 left-3 flex gap-2">
                      <p-tag *ngIf="product.isNew" [value]="'home.product_new' | translate"
                        styleClass="bg-rose-pastel text-white text-xs rounded-full px-2 py-1"></p-tag>
                      <p-tag *ngIf="product.isSeasonal" [value]="'home.product_seasonal' | translate"
                        styleClass="bg-primary-green text-white text-xs rounded-full px-2 py-1"></p-tag>
                    </div>
                  </div>
                  <div class="p-4">
                    <p class="text-xs text-gray-400 uppercase tracking-wider mb-1 capitalize">{{ product.category }}</p>
                    <h3 class="font-heading text-lg text-charcoal font-semibold mb-2 group-hover:text-primary-green transition-colors">
                      {{ product.name }}
                    </h3>
                    <p class="text-sm text-gray-500 mb-3 line-clamp-2">{{ product.shortDescription }}</p>
                    <div class="flex items-center gap-2 mb-3">
                      <p-rating [ngModel]="product.rating" [readonly]="true" [cancel]="false" [stars]="5"></p-rating>
                      <span class="text-xs text-gray-400">({{ product.reviewCount }})</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="flex items-baseline gap-2">
                        <span class="text-xl font-bold text-primary-green">{{ product.price }}€</span>
                        <span *ngIf="product.originalPrice" class="text-sm text-gray-400 line-through">{{ product.originalPrice }}€</span>
                      </div>
                      <button pButton
                        [label]="'home.product_see' | translate"
                        icon="pi pi-eye"
                        class="p-button-sm p-button-outlined"
                        style="border-color: #5a8a4a; color: #5a8a4a; border-radius: 1.5rem; font-size: 0.8rem;">
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </ng-template>
          </p-carousel>
        </div>
      </section>

      <!-- ── ABOUT TEASER ────────────────────────────────────────── -->
      <section class="section-padding bg-white overflow-hidden">
        <div class="container-custom">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div class="relative h-96 lg:h-[520px]">
              <img src="https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=500&q=80" alt="Atelier"
                class="absolute top-0 left-0 w-2/3 h-3/4 object-cover rounded-2xl shadow-xl" />
              <img src="https://images.unsplash.com/photo-1490750967868-88df5691cc36?w=400&q=80" alt="Fleurs"
                class="absolute bottom-0 right-0 w-1/2 h-1/2 object-cover rounded-2xl shadow-xl" />
              <div class="absolute top-1/2 right-6 -translate-y-1/2 bg-primary-green text-white rounded-2xl p-5 shadow-xl text-center">
                <p class="font-heading text-4xl font-bold">12</p>
                <p class="text-xs text-green-100 font-medium" [innerHTML]="'home.about_years' | translate"></p>
              </div>
            </div>

            <div>
              <p class="text-rose-accent uppercase tracking-widest text-sm font-semibold mb-4">{{ 'home.about_eyebrow' | translate }}</p>
              <h2 class="font-heading text-4xl text-charcoal mb-6">{{ 'about.founder_title' | translate }}</h2>
              <p class="text-gray-500 leading-relaxed mb-5">{{ 'home.about_p1' | translate }}</p>
              <p class="text-gray-500 leading-relaxed mb-8">{{ 'home.about_p2' | translate }}</p>
              <div class="flex flex-wrap gap-4 mb-10">
                <div *ngFor="let value of values" class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                    <i [class]="value.icon + ' text-primary-green text-sm'"></i>
                  </div>
                  <span class="text-sm font-medium text-charcoal">{{ value.labelKey | translate }}</span>
                </div>
              </div>
              <a routerLink="/a-propos">
                <button pButton
                  [label]="'home.about_cta' | translate"
                  icon="pi pi-arrow-right" iconPos="right"
                  style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.85rem 2rem;">
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- ── TESTIMONIALS ────────────────────────────────────────── -->
      <section class="section-padding bg-cream">
        <div class="container-custom">
          <div class="text-center mb-14">
            <p class="text-rose-accent uppercase tracking-widest text-sm font-semibold mb-3">{{ 'home.testimonials_eyebrow' | translate }}</p>
            <h2 class="font-heading text-4xl text-charcoal mb-4">{{ 'home.testimonials_title' | translate }}</h2>
            <p class="text-gray-500 max-w-xl mx-auto">{{ 'home.testimonials_desc' | translate }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div *ngFor="let t of testimonials"
              class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex gap-1 mb-4">
                <i *ngFor="let s of [1,2,3,4,5]"
                  class="pi pi-star-fill text-sm"
                  [style.color]="s <= t.rating ? '#e8a0b4' : '#e2e8f0'">
                </i>
              </div>
              <p class="text-gray-600 text-sm leading-relaxed mb-5 italic">"{{ t.comment }}"</p>
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-semibold text-charcoal text-sm">{{ t.name }}</p>
                  <p class="text-xs text-gray-400">{{ t.occasion }}</p>
                </div>
                <span class="text-xs text-gray-400">{{ t.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── CTA BAND ────────────────────────────────────────────── -->
      <section class="py-20 bg-primary-green relative overflow-hidden">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl"></div>
          <div class="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-white blur-3xl"></div>
        </div>
        <div class="container-custom text-center relative z-10">
          <p class="text-green-100 uppercase tracking-widest text-sm font-semibold mb-3">{{ 'home.cta_eyebrow' | translate }}</p>
          <h2 class="font-heading text-4xl text-white mb-5">{{ 'home.cta_title' | translate }}</h2>
          <p class="text-green-100 max-w-lg mx-auto mb-10 text-lg">{{ 'home.cta_desc' | translate }}</p>
          <div class="flex flex-wrap gap-4 justify-center">
            <a routerLink="/boutique">
              <button pButton
                [label]="'home.cta_shop' | translate"
                icon="pi pi-shopping-bag"
                style="background: white; color: #5a8a4a; border: none; border-radius: 2rem; padding: 0.85rem 2rem; font-size: 1rem;">
              </button>
            </a>
            <a routerLink="/contact">
              <button pButton
                [label]="'home.cta_contact' | translate"
                icon="pi pi-envelope"
                class="p-button-outlined"
                style="border-color: white; color: white; border-radius: 2rem; padding: 0.85rem 2rem; font-size: 1rem;">
              </button>
            </a>
          </div>
        </div>
      </section>

    </div>
  `
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  categories: Category[] = [];
  testimonials: Testimonial[] = [];

  stats = [
    { value: '500+', labelKey: 'home.stat_clients' },
    { value: '12', labelKey: 'home.stat_years' },
    { value: '100%', labelKey: 'home.stat_fresh' },
  ];

  values = [
    { icon: 'pi pi-leaf', labelKey: 'home.value_eco' },
    { icon: 'pi pi-heart', labelKey: 'home.value_love' },
    { icon: 'pi pi-verified', labelKey: 'home.value_quality' },
    { icon: 'pi pi-truck', labelKey: 'home.value_delivery' },
  ];

  carouselOptions = [
    { breakpoint: '1024px', numVisible: 3, numScroll: 1 },
    { breakpoint: '768px', numVisible: 2, numScroll: 1 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 },
  ];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getFeaturedProducts().subscribe(p => this.featuredProducts = p);
    this.productService.getCategories().subscribe(c => this.categories = c);
    this.productService.getTestimonials().subscribe(t => this.testimonials = t);
  }
}
