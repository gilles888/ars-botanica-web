import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product, getStartingPrice } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { MenuItem, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    CardModule, ButtonModule, SliderModule, CheckboxModule,
    DropdownModule, TagModule, RatingModule, PaginatorModule,
    InputTextModule, BreadcrumbModule, DividerModule, ToastModule, TooltipModule,
    TranslateModule
  ],
  providers: [MessageService],
  template: `
    <p-toast position="bottom-right"></p-toast>
    <div class="pt-20 min-h-screen bg-cream page-enter">

      <!-- Breadcrumb + Header -->
      <div class="bg-white border-b border-gray-100">
        <div class="container-custom py-8">
          <p-breadcrumb [model]="breadcrumb" [home]="breadcrumbHome"></p-breadcrumb>
          <div class="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 class="font-heading text-4xl text-charcoal">{{ 'shop.title' | translate }}</h1>
              <p class="text-gray-500 mt-2">{{ filteredProducts.length }} {{ 'shop.available' | translate }}</p>
            </div>
            <div class="flex items-center gap-2 w-full sm:w-72">
              <span class="p-input-icon-left flex-1">
                <i class="pi pi-search"></i>
                <input
                  pInputText
                  type="text"
                  [(ngModel)]="searchQuery"
                  (ngModelChange)="applyFilters()"
                  [placeholder]="'shop.search_placeholder' | translate"
                  class="w-full rounded-full"
                />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="container-custom py-10">
        <div class="flex flex-col lg:flex-row gap-8">

          <!-- ── SIDEBAR ─────────────────────────────────────── -->
          <aside class="lg:w-64 flex-shrink-0">
            <div class="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 class="font-semibold text-charcoal mb-5">{{ 'shop.filters' | translate }}</h3>

              <!-- Categories -->
              <div class="mb-6">
                <p class="text-xs uppercase tracking-widest text-gray-400 mb-3">{{ 'shop.categories' | translate }}</p>
                <div class="space-y-2">
                  <div *ngFor="let cat of categoryOptions" class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <p-checkbox
                        [binary]="true"
                        [(ngModel)]="cat.checked"
                        (ngModelChange)="applyFilters()"
                        [inputId]="cat.value"
                      ></p-checkbox>
                      <label [for]="cat.value" class="text-sm text-gray-600 cursor-pointer">{{ cat.labelKey | translate }}</label>
                    </div>
                    <span class="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{{ cat.count }}</span>
                  </div>
                </div>
              </div>

              <p-divider></p-divider>

              <!-- Price range -->
              <div class="mb-6">
                <p class="text-xs uppercase tracking-widest text-gray-400 mb-3">{{ 'shop.budget' | translate }}</p>
                <p-slider
                  [(ngModel)]="priceRange"
                  [range]="true"
                  [min]="0"
                  [max]="300"
                  (onSlideEnd)="applyFilters()"
                  styleClass="w-full"
                ></p-slider>
                <div class="flex justify-between text-sm text-gray-500 mt-3">
                  <span>{{ priceRange[0] }}€</span>
                  <span>{{ priceRange[1] }}€</span>
                </div>
              </div>

              <p-divider></p-divider>

              <!-- Tags -->
              <div class="mb-6">
                <p class="text-xs uppercase tracking-widest text-gray-400 mb-3">{{ 'shop.occasions' | translate }}</p>
                <div class="flex flex-wrap gap-2">
                  <span *ngFor="let tag of occasionTags"
                    (click)="toggleTag(tag)"
                    class="cursor-pointer text-xs px-3 py-1.5 rounded-full border transition-all"
                    [class.bg-primary-green]="selectedTags.includes(tag)"
                    [class.text-white]="selectedTags.includes(tag)"
                    [class.border-primary-green]="selectedTags.includes(tag)"
                    [class.border-gray-200]="!selectedTags.includes(tag)"
                    [class.text-gray-600]="!selectedTags.includes(tag)"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <button
                pButton
                [label]="'shop.clear_filters' | translate"
                class="p-button-text w-full"
                icon="pi pi-times"
                style="color: #5a8a4a; font-size: 0.875rem;"
                (click)="clearFilters()">
              </button>
            </div>
          </aside>

          <!-- ── PRODUCTS GRID ───────────────────────────────── -->
          <div class="flex-1">
            <!-- Sort bar -->
            <div class="flex items-center justify-between mb-6">
              <p class="text-sm text-gray-500">
                <span class="font-medium text-charcoal">{{ pagedProducts.length }}</span> {{ 'shop.results_shown' | translate }}
              </p>
              <p-dropdown
                [options]="sortOptions"
                [(ngModel)]="selectedSort"
                (ngModelChange)="applyFilters()"
                optionLabel="label"
                optionValue="value"
                [placeholder]="'shop.sort_by' | translate"
                styleClass="rounded-full text-sm border-gray-200"
              ></p-dropdown>
            </div>

            <!-- Loading -->
            <div *ngIf="loading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <div *ngFor="let i of [1,2,3,4,5,6]"
                class="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div class="aspect-[4/3] bg-gray-200"></div>
                <div class="p-5 space-y-3">
                  <div class="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div class="h-5 bg-gray-200 rounded w-2/3"></div>
                  <div class="h-3 bg-gray-200 rounded w-full"></div>
                  <div class="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>

            <!-- Error -->
            <div *ngIf="!loading && loadError" class="text-center py-24">
              <i class="pi pi-exclamation-triangle text-5xl text-red-300 mb-5"></i>
              <p class="font-heading text-2xl text-gray-400 mb-3">Impossible de charger les produits</p>
              <p class="text-gray-400 mb-4">Le serveur est inaccessible. Vérifiez que le backend tourne sur le port 8081.</p>
              <button pButton label="Réessayer" (click)="loadProducts()"
                style="background: #5a8a4a; border: none; border-radius: 2rem;">
              </button>
            </div>

            <!-- Grid -->
            <div *ngIf="!loading && !loadError && pagedProducts.length > 0"
              class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <div *ngFor="let product of pagedProducts"
                class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
                [routerLink]="['/boutique', product.slug]">
                <div class="relative overflow-hidden aspect-[4/3]">
                  <img [src]="product.images[0]" [alt]="product.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div class="absolute top-3 left-3 flex gap-2">
                    <span *ngIf="product.isNew"
                      class="bg-rose-pastel text-white text-xs rounded-full px-2.5 py-1 font-medium">
                      {{ 'shop.product_new' | translate }}
                    </span>
                  </div>
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span class="bg-white text-charcoal text-sm font-semibold px-5 py-2 rounded-full">
                      {{ 'shop.product_see_detail' | translate }}
                    </span>
                  </div>
                </div>

                <div class="p-5">
                  <p class="text-xs text-gray-400 uppercase tracking-wider mb-1 capitalize">{{ product.category }}</p>
                  <h3 class="font-heading text-lg text-charcoal font-semibold mb-2 group-hover:text-primary-green transition-colors line-clamp-1">
                    {{ product.name }}
                  </h3>
                  <p class="text-sm text-gray-500 mb-3 line-clamp-2">{{ product.shortDescription }}</p>

                  <div class="flex items-center gap-2 mb-4">
                    <p-rating [ngModel]="product.rating" [readonly]="true" [cancel]="false" [stars]="5"></p-rating>
                    <span class="text-xs text-gray-400">({{ product.reviewCount }})</span>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-baseline gap-2">
                      <span class="text-xl font-bold text-primary-green">à partir de {{ getStartingPrice(product) }}€</span>
                    </div>
                    <button pButton
                      icon="pi pi-shopping-cart"
                      class="p-button-rounded p-button-sm"
                      [pTooltip]="'shop.add_to_cart_tooltip' | translate"
                      tooltipPosition="top"
                      style="background: #5a8a4a; border: none; width: 36px; height: 36px;"
                      (click)="addToCart(product, $event)">
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- No results -->
            <div *ngIf="!loading && !loadError && pagedProducts.length === 0" class="text-center py-24">
                <i class="pi pi-search text-5xl text-gray-200 mb-5"></i>
                <p class="font-heading text-2xl text-gray-400 mb-3">{{ 'shop.no_results_title' | translate }}</p>
                <p class="text-gray-400 mb-6">{{ 'shop.no_results_desc' | translate }}</p>
                <button pButton [label]="'shop.reset' | translate" (click)="clearFilters()"
                  style="background: #5a8a4a; border: none; border-radius: 2rem;">
                </button>
            </div>

            <!-- Pagination -->
            <div *ngIf="filteredProducts.length > pageSize" class="mt-10">
              <p-paginator
                [rows]="pageSize"
                [totalRecords]="filteredProducts.length"
                (onPageChange)="onPageChange($event)"
                [rowsPerPageOptions]="[9, 18, 27]"
                styleClass="justify-center"
              ></p-paginator>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ShopComponent implements OnInit, OnDestroy {
  readonly getStartingPrice = getStartingPrice;

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  pagedProducts: Product[] = [];

  searchQuery = '';
  priceRange = [0, 300];
  selectedSort = 'featured';
  selectedTags: string[] = [];
  pageSize = 9;
  currentPage = 0;

  breadcrumb: MenuItem[] = [];
  breadcrumbHome: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  categoryOptions = [
    { labelKey: 'shop.cat_bouquets', value: 'bouquets', count: 4, checked: false },
    { labelKey: 'shop.cat_compositions', value: 'compositions', count: 3, checked: false },
    { labelKey: 'shop.cat_plantes', value: 'plantes', count: 3, checked: false },
    { labelKey: 'shop.cat_mariages', value: 'mariages', count: 2, checked: false },
    { labelKey: 'shop.cat_seasonal', value: 'seasonal', count: 1, checked: false },
  ];

  sortOptions: { label: string; value: string }[] = [];
  occasionTags = ['anniversaire', 'mariage', 'cadeau', 'décoration', 'fête'];

  loading = true;
  loadError = false;
  loadErrorMessage = '';

  private langSub = new Subscription();

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private messageService: MessageService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.buildSortOptions();
    this.updateBreadcrumb();
    this.langSub.add(this.translate.onLangChange.subscribe(() => {
      this.buildSortOptions();
      this.updateBreadcrumb();
    }));

    this.loadProducts();
  }

  ngOnDestroy() {
    this.langSub.unsubscribe();
  }

  loadProducts() {
    this.loading = true;
    this.loadError = false;
    this.productService.getProducts().pipe(
      catchError(err => {
        this.loadErrorMessage = err?.message ?? err?.error?.message ?? JSON.stringify(err?.error ?? err?.status ?? err);
        console.error('Erreur chargement produits:', err);
        this.loadError = true;
        this.loading = false;
        return of([]);
      })
    ).subscribe(products => {
      this.allProducts = products;
      this.loading = false;
      this.route.queryParams.subscribe(params => {
        if (params['categorie']) {
          const catOpt = this.categoryOptions.find(c => c.value === params['categorie']);
          if (catOpt) catOpt.checked = true;
        }
        this.applyFilters();
      });
    });
  }

  buildSortOptions() {
    this.sortOptions = [
      { label: this.translate.instant('shop.sort_featured'), value: 'featured' },
      { label: this.translate.instant('shop.sort_price_asc'), value: 'price-asc' },
      { label: this.translate.instant('shop.sort_price_desc'), value: 'price-desc' },
      { label: this.translate.instant('shop.sort_rating'), value: 'rating' },
      { label: this.translate.instant('shop.sort_newest'), value: 'newest' },
    ];
  }

  updateBreadcrumb() {
    this.breadcrumb = [{ label: this.translate.instant('shop.title') }];
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    const variant = product.variants?.find(v => v.size === 'PETIT') ?? product.variants?.[0];
    if (!variant) return;
    this.cartService.addItem(product, variant);
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant('shop.added_to_cart'),
      detail: product.name,
      life: 2500
    });
  }

  applyFilters() {
    let result = [...this.allProducts];
    const checkedCats = this.categoryOptions.filter(c => c.checked).map(c => c.value);
    if (checkedCats.length > 0) result = result.filter(p => checkedCats.includes(p.category));
    result = result.filter(p => {
      const startingPrice = getStartingPrice(p);
      return startingPrice >= this.priceRange[0] && startingPrice <= this.priceRange[1];
    });
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)));
    }
    if (this.selectedTags.length > 0) {
      result = result.filter(p => this.selectedTags.every(tag => p.occasion?.includes(tag)));
    }
    switch (this.selectedSort) {
      case 'price-asc': result.sort((a, b) => getStartingPrice(a) - getStartingPrice(b)); break;
      case 'price-desc': result.sort((a, b) => getStartingPrice(b) - getStartingPrice(a)); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      default: result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    this.filteredProducts = result;
    this.currentPage = 0;
    this.updatePage();
  }

  updatePage() {
    const start = this.currentPage * this.pageSize;
    this.pagedProducts = this.filteredProducts.slice(start, start + this.pageSize);
  }

  onPageChange(event: PaginatorState) {
    this.currentPage = (event.first ?? 0) / (event.rows ?? this.pageSize);
    this.pageSize = event.rows ?? this.pageSize;
    this.updatePage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleTag(tag: string) {
    const idx = this.selectedTags.indexOf(tag);
    if (idx > -1) this.selectedTags.splice(idx, 1);
    else this.selectedTags.push(tag);
    this.applyFilters();
  }

  clearFilters() {
    this.categoryOptions.forEach(c => c.checked = false);
    this.priceRange = [0, 300];
    this.searchQuery = '';
    this.selectedSort = 'featured';
    this.selectedTags = [];
    this.applyFilters();
  }
}
