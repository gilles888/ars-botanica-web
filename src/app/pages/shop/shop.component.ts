import { Component, OnInit } from '@angular/core';
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
import { Product } from '../../core/models/product.model';
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
    InputTextModule, BreadcrumbModule, DividerModule, ToastModule, TooltipModule
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
              <h1 class="font-heading text-4xl text-charcoal">Notre Boutique</h1>
              <p class="text-gray-500 mt-2">{{ filteredProducts.length }} créations disponibles</p>
            </div>
            <!-- Search -->
            <div class="flex items-center gap-2 w-full sm:w-72">
              <span class="p-input-icon-left flex-1">
                <i class="pi pi-search"></i>
                <input
                  pInputText
                  type="text"
                  [(ngModel)]="searchQuery"
                  (ngModelChange)="applyFilters()"
                  placeholder="Rechercher..."
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
              <h3 class="font-semibold text-charcoal mb-5">Filtres</h3>

              <!-- Categories -->
              <div class="mb-6">
                <p class="text-xs uppercase tracking-widest text-gray-400 mb-3">Catégories</p>
                <div class="space-y-2">
                  <div *ngFor="let cat of categoryOptions" class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <p-checkbox
                        [binary]="true"
                        [(ngModel)]="cat.checked"
                        (ngModelChange)="applyFilters()"
                        [inputId]="cat.value"
                      ></p-checkbox>
                      <label [for]="cat.value" class="text-sm text-gray-600 cursor-pointer">{{ cat.label }}</label>
                    </div>
                    <span class="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{{ cat.count }}</span>
                  </div>
                </div>
              </div>

              <p-divider></p-divider>

              <!-- Price range -->
              <div class="mb-6">
                <p class="text-xs uppercase tracking-widest text-gray-400 mb-3">Budget</p>
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
                <p class="text-xs uppercase tracking-widest text-gray-400 mb-3">Occasions</p>
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
                label="Effacer les filtres"
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
                <span class="font-medium text-charcoal">{{ pagedProducts.length }}</span> résultats affichés
              </p>
              <p-dropdown
                [options]="sortOptions"
                [(ngModel)]="selectedSort"
                (ngModelChange)="applyFilters()"
                optionLabel="label"
                optionValue="value"
                placeholder="Trier par"
                styleClass="rounded-full text-sm border-gray-200"
              ></p-dropdown>
            </div>

            <!-- Grid -->
            <div *ngIf="pagedProducts.length > 0; else noResults"
              class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <div *ngFor="let product of pagedProducts"
                class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
                [routerLink]="['/boutique', product.slug]">
                <!-- Image -->
                <div class="relative overflow-hidden aspect-[4/3]">
                  <img
                    [src]="product.images[0]"
                    [alt]="product.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div class="absolute top-3 left-3 flex gap-2">
                    <span *ngIf="product.isNew"
                      class="bg-rose-pastel text-white text-xs rounded-full px-2.5 py-1 font-medium">
                      Nouveau
                    </span>
                    <span *ngIf="product.originalPrice"
                      class="bg-primary-green text-white text-xs rounded-full px-2.5 py-1 font-medium">
                      -{{ getDiscount(product) }}%
                    </span>
                  </div>
                  <!-- Quick view overlay -->
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span class="bg-white text-charcoal text-sm font-semibold px-5 py-2 rounded-full">
                      Voir le détail
                    </span>
                  </div>
                </div>

                <!-- Info -->
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
                      <span class="text-xl font-bold text-primary-green">{{ product.price }}€</span>
                      <span *ngIf="product.originalPrice" class="text-sm text-gray-400 line-through">{{ product.originalPrice }}€</span>
                    </div>
                    <button pButton
                      icon="pi pi-shopping-cart"
                      class="p-button-rounded p-button-sm"
                      pTooltip="Ajouter au panier"
                      tooltipPosition="top"
                      style="background: #5a8a4a; border: none; width: 36px; height: 36px;"
                      (click)="addToCart(product, $event)">
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- No results -->
            <ng-template #noResults>
              <div class="text-center py-24">
                <i class="pi pi-search text-5xl text-gray-200 mb-5"></i>
                <p class="font-heading text-2xl text-gray-400 mb-3">Aucune création trouvée</p>
                <p class="text-gray-400 mb-6">Essayez d'ajuster vos filtres.</p>
                <button pButton label="Réinitialiser" (click)="clearFilters()"
                  style="background: #5a8a4a; border: none; border-radius: 2rem;">
                </button>
              </div>
            </ng-template>

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
export class ShopComponent implements OnInit {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  pagedProducts: Product[] = [];

  searchQuery = '';
  priceRange = [0, 300];
  selectedSort = 'featured';
  selectedTags: string[] = [];
  pageSize = 9;
  currentPage = 0;

  breadcrumb: MenuItem[] = [{ label: 'Boutique' }];
  breadcrumbHome: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  categoryOptions = [
    { label: 'Bouquets', value: 'bouquets', count: 4, checked: false },
    { label: 'Compositions', value: 'compositions', count: 3, checked: false },
    { label: 'Plantes', value: 'plantes', count: 3, checked: false },
    { label: 'Mariages', value: 'mariages', count: 2, checked: false },
    { label: 'Saisonniers', value: 'seasonal', count: 1, checked: false },
  ];

  sortOptions = [
    { label: 'Mis en avant', value: 'featured' },
    { label: 'Prix croissant', value: 'price-asc' },
    { label: 'Prix décroissant', value: 'price-desc' },
    { label: 'Mieux notés', value: 'rating' },
    { label: 'Nouveautés', value: 'newest' },
  ];

  occasionTags = ['anniversaire', 'mariage', 'cadeau', 'décoration', 'fête'];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private messageService: MessageService
  ) {}

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    this.cartService.addItem(product);
    this.messageService.add({
      severity: 'success',
      summary: 'Ajouté au panier',
      detail: product.name,
      life: 2500
    });
  }

  ngOnInit() {
    this.productService.getProducts().subscribe(products => {
      this.allProducts = products;
      // Check if a category filter is in query params
      this.route.queryParams.subscribe(params => {
        if (params['categorie']) {
          const catOpt = this.categoryOptions.find(c => c.value === params['categorie']);
          if (catOpt) catOpt.checked = true;
        }
        this.applyFilters();
      });
    });
  }

  applyFilters() {
    let result = [...this.allProducts];

    // Category
    const checkedCats = this.categoryOptions.filter(c => c.checked).map(c => c.value);
    if (checkedCats.length > 0) {
      result = result.filter(p => checkedCats.includes(p.category));
    }

    // Price
    result = result.filter(p => p.price >= this.priceRange[0] && p.price <= this.priceRange[1]);

    // Search
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      );
    }

    // Tags/occasions
    if (this.selectedTags.length > 0) {
      result = result.filter(p =>
        this.selectedTags.every(tag => p.occasion?.includes(tag))
      );
    }

    // Sort
    switch (this.selectedSort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
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

  getDiscount(product: Product): number {
    if (!product.originalPrice) return 0;
    return Math.round((1 - product.price / product.originalPrice) * 100);
  }
}
