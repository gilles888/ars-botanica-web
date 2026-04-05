import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { GalleriaModule } from 'primeng/galleria';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MessageService, MenuItem } from 'primeng/api';
import { Product, ProductVariant, getStartingPrice, localizedField } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    ButtonModule, RatingModule, TagModule, BreadcrumbModule,
    GalleriaModule, DividerModule, InputNumberModule, ToastModule,
    SelectButtonModule, TranslateModule
  ],
  providers: [MessageService],
  template: `
    <p-toast position="bottom-right"></p-toast>
    <div class="pt-20 min-h-screen bg-cream page-enter">

      <!-- Breadcrumb -->
      <div class="bg-white border-b border-gray-100">
        <div class="container-custom py-5">
          <p-breadcrumb [model]="breadcrumb" [home]="breadcrumbHome"></p-breadcrumb>
        </div>
      </div>

      <div *ngIf="product; else loading" class="container-custom py-12">

        <!-- Main product -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-14 mb-20">

          <!-- Gallery -->
          <div>
            <!-- Main image -->
            <div class="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg mb-4 cursor-pointer"
              (click)="selectedImageIndex = 0">
              <img
                [src]="product.images[selectedImageIndex]"
                [alt]="localizedField(product, 'name', currentLang)"
                class="w-full h-full object-cover"
              />
              <div class="absolute top-4 left-4 flex gap-2">
                <span *ngIf="product.isNew"
                  class="bg-rose-pastel text-white text-xs rounded-full px-3 py-1.5 font-medium">
                  Nouveau
                </span>
                <span *ngIf="product.isSeasonal"
                  class="bg-primary-green text-white text-xs rounded-full px-3 py-1.5 font-medium">
                  Saisonnier
                </span>
              </div>
            </div>
            <!-- Thumbnails -->
            <div *ngIf="product.images.length > 1" class="flex gap-3">
              <button
                *ngFor="let img of product.images; let i = index"
                (click)="selectedImageIndex = i"
                class="rounded-xl overflow-hidden w-20 h-20 border-2 transition-all"
                [class.border-primary-green]="selectedImageIndex === i"
                [class.border-transparent]="selectedImageIndex !== i"
              >
                <img [src]="img" [alt]="'Image ' + (i+1)" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Info -->
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-widest mb-2 capitalize">{{ product.category }}</p>
            <h1 class="font-heading text-4xl text-charcoal font-bold mb-4">{{ localizedField(product, 'name', currentLang) }}</h1>

            <!-- Rating -->
            <div class="flex items-center gap-3 mb-5">
              <p-rating [ngModel]="product.rating" [readonly]="true" [cancel]="false" [stars]="5"></p-rating>
              <span class="text-sm text-gray-500">{{ product.rating }}/5 ({{ product.reviewCount }} avis)</span>
            </div>

            <!-- Price -->
            <div class="flex items-baseline gap-3 mb-6">
              <span class="text-4xl font-bold text-primary-green">{{ selectedVariant?.price ?? getStartingPrice(product) }}€</span>
            </div>

            <!-- Size selector -->
            <div class="mb-6" *ngIf="product.variants && product.variants.length > 0">
              <p class="text-sm font-medium text-charcoal mb-3">Taille</p>
              <div class="flex gap-2">
                <button
                  *ngFor="let variant of product.variants"
                  (click)="selectVariant(variant)"
                  class="px-4 py-2 rounded-full border-2 text-sm font-medium transition-all"
                  [class.border-primary-green]="selectedVariant?.id === variant.id"
                  [class.bg-primary-green]="selectedVariant?.id === variant.id"
                  [class.text-white]="selectedVariant?.id === variant.id"
                  [class.border-gray-200]="selectedVariant?.id !== variant.id"
                  [class.text-gray-600]="selectedVariant?.id !== variant.id"
                  [class.hover:border-primary-green]="selectedVariant?.id !== variant.id"
                >
                  {{ sizeLabel(variant.size) }} — {{ variant.price }}€
                </button>
              </div>
            </div>

            <p-divider></p-divider>

            <!-- Description -->
            <p class="text-gray-600 leading-relaxed mb-6">{{ localizedField(product, 'description', currentLang) }}</p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-6" *ngIf="product.occasion?.length">
              <span class="text-sm text-gray-500 mr-1">Occasions :</span>
              <span *ngFor="let occ of product.occasion"
                class="text-xs bg-green-50 text-primary-green rounded-full px-3 py-1 font-medium capitalize">
                {{ occ }}
              </span>
            </div>

            <!-- Colors -->
            <div class="flex flex-wrap items-center gap-2 mb-8" *ngIf="product.colors?.length">
              <span class="text-sm text-gray-500">Couleurs :</span>
              <span *ngFor="let color of product.colors"
                class="text-xs bg-gray-100 text-charcoal rounded-full px-3 py-1 capitalize">
                {{ color }}
              </span>
            </div>

            <!-- CTA -->
            <div class="space-y-3">
              <!-- Quantity + Add to cart -->
              <div class="flex items-center gap-3">
                <div class="flex items-center border border-gray-200 rounded-full overflow-hidden">
                  <button class="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold text-lg"
                    (click)="quantity > 1 && quantity = quantity - 1">−</button>
                  <span class="w-10 text-center font-semibold text-charcoal">{{ quantity }}</span>
                  <button class="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold text-lg"
                    (click)="quantity = quantity + 1">+</button>
                </div>
                <button pButton
                  label="Ajouter au panier"
                  icon="pi pi-shopping-cart"
                  class="flex-1"
                  style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.85rem 1.5rem;"
                  (click)="addToCart()">
                </button>
              </div>
              <!-- Custom order link -->
              <div class="bg-green-50 rounded-xl p-4 flex items-start gap-3">
                <i class="pi pi-info-circle text-primary-green mt-0.5 flex-shrink-0"></i>
                <p class="text-sm text-gray-600">
                  Pour une création sur mesure (mariage, événement),
                  <a routerLink="/contact" class="text-primary-green font-medium hover:underline">contactez-nous</a>.
                </p>
              </div>
            </div>

            <!-- Features -->
            <div class="grid grid-cols-3 gap-4 mt-6">
              <div *ngFor="let feat of features" class="text-center">
                <div class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-2">
                  <i [class]="feat.icon + ' text-primary-green'"></i>
                </div>
                <p class="text-xs text-gray-500">{{ feat.label }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Related products -->
        <div *ngIf="relatedProducts.length > 0">
          <h2 class="font-heading text-3xl text-charcoal mb-8">Vous aimerez aussi</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div *ngFor="let rp of relatedProducts"
              class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
              [routerLink]="['/boutique', rp.slug]">
              <div class="relative overflow-hidden aspect-[4/3]">
                <img
                  [src]="rp.images[0]" [alt]="localizedField(rp, 'name', currentLang)"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div class="p-4">
                <h3 class="font-heading text-base text-charcoal font-semibold mb-1 group-hover:text-primary-green transition-colors">
                  {{ localizedField(rp, 'name', currentLang) }}
                </h3>
                <div class="flex items-center justify-between">
                  <span class="text-lg font-bold text-primary-green">à partir de {{ getStartingPrice(rp) }}€</span>
                  <p-rating [ngModel]="rp.rating" [readonly]="true" [cancel]="false" [stars]="5"></p-rating>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <ng-template #loading>
        <div class="container-custom py-24 text-center">
          <i class="pi pi-spin pi-spinner text-5xl text-primary-green"></i>
          <p class="text-gray-500 mt-4">Chargement...</p>
        </div>
      </ng-template>
    </div>
  `
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  readonly getStartingPrice = getStartingPrice;
  // Référence à la fonction de localisation pour l'utiliser dans le template
  readonly localizedField = localizedField;
  // Langue courante, synchronisée avec TranslateService
  currentLang = 'fr';

  private langSub = new Subscription();

  product: Product | undefined;
  relatedProducts: Product[] = [];
  selectedImageIndex = 0;
  quantity = 1;
  selectedVariant: ProductVariant | null = null;

  breadcrumb: MenuItem[] = [];
  breadcrumbHome: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  features = [
    { icon: 'pi pi-leaf', label: 'Fleurs fraîches' },
    { icon: 'pi pi-heart', label: 'Fait main' },
    { icon: 'pi pi-truck', label: 'Livraison soignée' },
  ];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private cartService: CartService,
    private translate: TranslateService
  ) {}

  sizeLabel(size: string): string {
    const labels: Record<string, string> = { PETIT: 'Petit', MOYEN: 'Moyen', GRAND: 'Grand' };
    return labels[size] ?? size;
  }

  selectVariant(variant: ProductVariant): void {
    this.selectedVariant = variant;
  }

  addToCart(): void {
    if (!this.product) return;
    const variant = this.selectedVariant ?? this.product.variants?.[0];
    if (!variant) return;
    this.cartService.addItem(this.product, variant, this.quantity);
    this.messageService.add({
      severity: 'success',
      summary: 'Ajouté au panier',
      detail: `${this.quantity}× ${this.product.name} (${this.sizeLabel(variant.size)})`,
      life: 2500
    });
  }

  ngOnDestroy() {
    this.langSub.unsubscribe();
  }

  ngOnInit() {
    // Initialisation de la langue courante et souscription aux changements
    this.currentLang = this.translate.currentLang || 'fr';
    this.langSub.add(this.translate.onLangChange.subscribe(() => {
      this.currentLang = this.translate.currentLang || 'fr';
    }));

    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.productService.getProductBySlug(slug).subscribe(product => {
        if (!product) {
          this.router.navigate(['/boutique']);
          return;
        }
        this.product = product;
        this.quantity = 1;
        this.selectedVariant = product.variants?.find(v => v.size === 'MOYEN') ?? product.variants?.[0] ?? null;
        this.breadcrumb = [
          { label: 'Boutique', routerLink: '/boutique' },
          { label: product.name }
        ];
        this.productService.getRelatedProducts(product).subscribe(r => this.relatedProducts = r);
        this.selectedImageIndex = 0;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }
}
