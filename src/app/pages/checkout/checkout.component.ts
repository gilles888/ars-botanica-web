import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { StepsModule } from 'primeng/steps';
import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { MessageService, MenuItem } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { loadStripe, StripeEmbeddedCheckout } from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    ButtonModule, InputTextModule, DropdownModule,
    StepsModule, DividerModule, RadioButtonModule, ToastModule,
    TranslateModule
  ],
  providers: [MessageService],
  template: `
    <p-toast position="bottom-right"></p-toast>
    <div class="pt-20 min-h-screen bg-cream page-enter">

      <!-- Panier vide -->
      <div *ngIf="cartItems.length === 0" class="container-custom py-24 text-center">
        <i class="pi pi-shopping-bag text-5xl text-gray-200 mb-5 block"></i>
        <h2 class="font-heading text-3xl text-charcoal mb-3">{{ 'checkout.empty_title' | translate }}</h2>
        <a routerLink="/boutique">
          <button pButton [label]="'cart.see_shop' | translate"
            style="background: #5a8a4a; border: none; border-radius: 2rem; margin-top: 1rem;">
          </button>
        </a>
      </div>

      <div *ngIf="cartItems.length > 0">

        <!-- Header -->
        <div class="bg-white border-b border-gray-100">
          <div class="container-custom py-8">
            <h1 class="font-heading text-4xl text-charcoal mb-6">{{ 'checkout.title' | translate }}</h1>
            <p-steps [model]="steps" [activeIndex]="step" [readonly]="true"></p-steps>
          </div>
        </div>

        <div class="container-custom py-12">
          <div class="flex flex-col lg:flex-row gap-10">

            <!-- Zone principale -->
            <div class="flex-1">

              <!-- ── ÉTAPE 0 : Informations ─────────────── -->
              <div *ngIf="step === 0" class="bg-white rounded-2xl shadow-sm p-8">
                <h2 class="font-heading text-2xl text-charcoal mb-6">{{ 'checkout.info_title' | translate }}</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-charcoal">{{ 'checkout.firstname' | translate }}</label>
                    <input pInputText [(ngModel)]="info.firstName" placeholder="Marie" class="rounded-xl" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-charcoal">{{ 'checkout.lastname' | translate }}</label>
                    <input pInputText [(ngModel)]="info.lastName" placeholder="Dupont" class="rounded-xl" />
                  </div>
                  <div class="flex flex-col gap-2 sm:col-span-2">
                    <label class="text-sm font-medium text-charcoal">{{ 'checkout.email' | translate }}</label>
                    <input pInputText type="email" [(ngModel)]="info.email" placeholder="marie@exemple.fr" class="rounded-xl" />
                  </div>
                  <div class="flex flex-col gap-2 sm:col-span-2">
                    <label class="text-sm font-medium text-charcoal">{{ 'checkout.phone' | translate }}</label>
                    <input pInputText type="tel" [(ngModel)]="info.phone" placeholder="+33 6 00 00 00 00" class="rounded-xl" />
                  </div>
                </div>
                <div class="flex justify-end mt-8">
                  <button pButton
                    [label]="'checkout.continue_delivery' | translate"
                    icon="pi pi-arrow-right" iconPos="right"
                    (click)="nextStep()"
                    style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.85rem 2rem;">
                  </button>
                </div>
              </div>

              <!-- ── ÉTAPE 1 : Livraison ────────────────── -->
              <div *ngIf="step === 1" class="bg-white rounded-2xl shadow-sm p-8">
                <h2 class="font-heading text-2xl text-charcoal mb-6">{{ 'checkout.delivery_title' | translate }}</h2>
                <div class="space-y-5">
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-charcoal">{{ 'checkout.address' | translate }}</label>
                    <input pInputText [(ngModel)]="delivery.address" placeholder="12 rue des Lilas" class="rounded-xl" />
                  </div>
                  <div class="grid grid-cols-2 gap-5">
                    <div class="flex flex-col gap-2">
                      <label class="text-sm font-medium text-charcoal">{{ 'checkout.zip' | translate }}</label>
                      <input pInputText [(ngModel)]="delivery.zip" placeholder="75004" class="rounded-xl" />
                    </div>
                    <div class="flex flex-col gap-2">
                      <label class="text-sm font-medium text-charcoal">{{ 'checkout.city' | translate }}</label>
                      <input pInputText [(ngModel)]="delivery.city" placeholder="Paris" class="rounded-xl" />
                    </div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-charcoal">{{ 'checkout.notes' | translate }}</label>
                    <input pInputText [(ngModel)]="delivery.notes" [placeholder]="'checkout.notes_placeholder' | translate" class="rounded-xl" />
                  </div>
                </div>

                <h3 class="font-semibold text-charcoal mt-8 mb-4">{{ 'checkout.shipping_method' | translate }}</h3>
                <div class="space-y-3">
                  <label *ngFor="let method of shippingMethods"
                    class="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all"
                    [class.border-primary-green]="delivery.method === method.value"
                    [class.bg-green-50]="delivery.method === method.value"
                    [class.border-gray-200]="delivery.method !== method.value">
                    <p-radioButton [value]="method.value" [(ngModel)]="delivery.method" [name]="'shipping'"></p-radioButton>
                    <div class="flex-1">
                      <div class="flex items-center justify-between">
                        <span class="font-medium text-charcoal">{{ method.labelKey | translate }}</span>
                        <span class="font-bold" [class.text-primary-green]="method.price === 0">
                          {{ method.price === 0 ? ('checkout.shipping_free' | translate) : method.price + '€' }}
                        </span>
                      </div>
                      <p class="text-xs text-gray-500 mt-0.5">{{ method.descKey | translate }}</p>
                    </div>
                  </label>
                </div>

                <div class="flex justify-between mt-8">
                  <button pButton [label]="'checkout.back' | translate" icon="pi pi-arrow-left" class="p-button-text"
                    style="color: #5a8a4a;" (click)="step = 0">
                  </button>
                  <button pButton [label]="'checkout.continue_payment' | translate"
                    icon="pi pi-arrow-right" iconPos="right"
                    (click)="nextStep()"
                    style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.85rem 2rem;">
                  </button>
                </div>
              </div>

              <!-- ── ÉTAPE 2 : Récapitulatif & Paiement Stripe ── -->
              <div *ngIf="step === 2" class="bg-white rounded-2xl shadow-sm p-8">
                <h2 class="font-heading text-2xl text-charcoal mb-2">{{ 'checkout.recap_title' | translate }}</h2>
                <p class="text-sm text-gray-500 flex items-center gap-2 mb-8">
                  <i class="pi pi-lock text-primary-green"></i>
                  {{ 'checkout.recap_secure' | translate }}
                </p>

                <!-- Récap livraison -->
                <div class="bg-gray-50 rounded-xl p-5 mb-5 space-y-1 text-sm">
                  <p class="font-semibold text-charcoal mb-2">{{ 'checkout.recap_delivery' | translate }}</p>
                  <p class="text-gray-600">{{ info.firstName }} {{ info.lastName }}</p>
                  <p class="text-gray-600">{{ delivery.address }}, {{ delivery.zip }} {{ delivery.city }}</p>
                  <p class="text-gray-600">{{ shippingMethodLabel }}</p>
                </div>

                <!-- Récap articles -->
                <div class="space-y-3 mb-5">
                  <div *ngFor="let item of cartItems" class="flex items-center gap-3">
                    <img [src]="item.product.images[0]" [alt]="item.product.name"
                      class="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-charcoal line-clamp-1">{{ item.product.name }}</p>
                      <p class="text-xs text-gray-500">{{ item.quantity }}×</p>
                    </div>
                    <span class="text-sm font-bold text-charcoal">{{ item.variant.price * item.quantity }}€</span>
                  </div>
                </div>

                <p-divider></p-divider>

                <div class="space-y-1 text-sm mb-6">
                  <div class="flex justify-between text-gray-500">
                    <span>{{ 'checkout.subtotal' | translate }}</span><span>{{ cartService.getSubtotal() }}€</span>
                  </div>
                  <div class="flex justify-between text-gray-500">
                    <span>{{ 'checkout.shipping' | translate }}</span>
                    <span *ngIf="shippingCost > 0">{{ shippingCost }}€</span>
                    <span *ngIf="shippingCost === 0" class="text-primary-green font-medium">{{ 'checkout.shipping_free_label' | translate }}</span>
                  </div>
                  <div class="flex justify-between font-bold text-charcoal text-base pt-1">
                    <span>{{ 'checkout.total' | translate }}</span>
                    <span class="text-primary-green">{{ cartService.getSubtotal() + shippingCost }}€</span>
                  </div>
                </div>

                <!-- Embedded Stripe Checkout -->
                <div *ngIf="!stripeReady" class="mt-6">
                  <button pButton [label]="'checkout.back' | translate" icon="pi pi-arrow-left" class="p-button-text mb-4"
                    style="color: #5a8a4a;" (click)="step = 1" [disabled]="processing">
                  </button>
                  <button pButton
                    [loading]="processing"
                    (click)="initStripeCheckout()"
                    class="w-full"
                    style="background: #635bff; border: none; border-radius: 2rem; padding: 0.85rem 2rem; font-size: 1rem;">
                    <span class="flex items-center justify-center gap-2">
                      <i class="pi pi-lock"></i>
                      {{ 'checkout.pay_btn' | translate: { amount: cartService.getSubtotal() + shippingCost } }}
                    </span>
                  </button>
                </div>

                <div *ngIf="stripeReady" class="mt-6">
                  <button pButton [label]="'checkout.back' | translate" icon="pi pi-arrow-left" class="p-button-text mb-4"
                    style="color: #5a8a4a;" (click)="cancelStripeCheckout()">
                  </button>
                  <div id="stripe-checkout"></div>
                </div>
              </div>

            </div>

            <!-- Récap sidebar -->
            <div class="lg:w-80 flex-shrink-0">
              <div class="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h3 class="font-heading text-lg text-charcoal font-semibold mb-4">{{ 'checkout.your_order' | translate }}</h3>

                <div class="space-y-3 mb-5">
                  <div *ngFor="let item of cartItems" class="flex items-center gap-3">
                    <div class="relative">
                      <img [src]="item.product.images[0]" [alt]="item.product.name"
                        class="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                      <span class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-600 text-white text-xs flex items-center justify-center font-bold">
                        {{ item.quantity }}
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-charcoal line-clamp-1">{{ item.product.name }}</p>
                    </div>
                    <span class="text-sm font-bold text-charcoal flex-shrink-0">{{ item.variant.price * item.quantity }}€</span>
                  </div>
                </div>

                <p-divider></p-divider>

                <div class="space-y-2 text-sm mb-4">
                  <div class="flex justify-between text-gray-500">
                    <span>{{ 'checkout.subtotal' | translate }}</span>
                    <span>{{ cartService.getSubtotal() }}€</span>
                  </div>
                  <div class="flex justify-between text-gray-500">
                    <span>{{ 'checkout.shipping' | translate }}</span>
                    <span *ngIf="shippingCost > 0">{{ shippingCost }}€</span>
                    <span *ngIf="shippingCost === 0" class="text-primary-green font-medium">{{ 'checkout.shipping_free_label' | translate }}</span>
                  </div>
                </div>

                <div class="flex justify-between font-bold">
                  <span class="text-charcoal">{{ 'checkout.total' | translate }}</span>
                  <span class="text-xl text-primary-green">{{ cartService.getSubtotal() + shippingCost }}€</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit, OnDestroy {
  step = 0;
  processing = false;
  stripeReady = false;
  private stripeCheckout: StripeEmbeddedCheckout | null = null;
  steps: MenuItem[] = [];

  info = { firstName: '', lastName: '', email: '', phone: '' };
  delivery = { address: '', zip: '', city: '', notes: '', method: 'standard' };

  shippingMethods = [
    { value: 'standard', labelKey: 'checkout.ship_standard_label', descKey: 'checkout.ship_standard_desc', price: 6.9 },
    { value: 'express', labelKey: 'checkout.ship_express_label', descKey: 'checkout.ship_express_desc', price: 12.9 },
    { value: 'free', labelKey: 'checkout.ship_pickup_label', descKey: 'checkout.ship_pickup_desc', price: 0 },
  ];

  private langSub = new Subscription();

  get cartItems() { return this.cartService.cartItems(); }

  get shippingCost(): number {
    const method = this.shippingMethods.find(m => m.value === this.delivery.method);
    if (!method || method.price === 0) return 0;
    return this.cartService.getSubtotal() >= 80 ? 0 : method.price;
  }

  get shippingMethodLabel(): string {
    const method = this.shippingMethods.find(m => m.value === this.delivery.method);
    return method ? this.translate.instant(method.labelKey) : '';
  }

  constructor(
    public cartService: CartService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/connexion'], { queryParams: { returnUrl: '/commande' } });
    }
    this.buildSteps();
    this.langSub.add(this.translate.onLangChange.subscribe(() => this.buildSteps()));
  }

  ngOnDestroy() {
    this.langSub.unsubscribe();
    this.stripeCheckout?.destroy();
  }

  buildSteps() {
    this.steps = [
      { label: this.translate.instant('checkout.step_info') },
      { label: this.translate.instant('checkout.step_delivery') },
      { label: this.translate.instant('checkout.step_payment') },
    ];
  }

  nextStep() {
    if (this.step === 0 && (!this.info.firstName || !this.info.email)) {
      this.messageService.add({
        severity: 'warn',
        summary: this.translate.instant('checkout.toast_required'),
        detail: this.translate.instant('checkout.toast_fill_info')
      });
      return;
    }
    if (this.step === 1 && (!this.delivery.address || !this.delivery.zip || !this.delivery.city)) {
      this.messageService.add({
        severity: 'warn',
        summary: this.translate.instant('checkout.toast_required'),
        detail: this.translate.instant('checkout.toast_fill_address')
      });
      return;
    }
    this.step++;
  }

  async initStripeCheckout() {
    this.processing = true;
    const payload = {
      deliveryAddress: this.delivery.address,
      deliveryZip: this.delivery.zip,
      deliveryCity: this.delivery.city,
      deliveryNotes: this.delivery.notes,
      deliveryMethod: this.delivery.method,
      items: this.cartService.cartItems().map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        variantId: item.variant.id
      }))
    };
    this.http.post<{ clientSecret: string; sessionId: string; orderNumber: string }>(
      `${environment.apiUrl}/payments/checkout`, payload
    ).subscribe({
      next: async (res) => {
        this.processing = false;
        const stripe = await loadStripe(environment.stripePublishableKey);
        if (!stripe) {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Stripe non disponible' });
          return;
        }
        this.stripeCheckout = await stripe.initEmbeddedCheckout({ clientSecret: res.clientSecret });
        this.stripeReady = true;
        // Attendre que le DOM soit rendu avant de monter
        setTimeout(() => this.stripeCheckout?.mount('#stripe-checkout'), 0);
      },
      error: () => {
        this.processing = false;
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('checkout.toast_error'),
          detail: this.translate.instant('checkout.toast_error_detail')
        });
      }
    });
  }

  cancelStripeCheckout() {
    this.stripeCheckout?.destroy();
    this.stripeCheckout = null;
    this.stripeReady = false;
    this.step = 1;
  }
}
