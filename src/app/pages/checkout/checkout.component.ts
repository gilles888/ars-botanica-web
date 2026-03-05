import { Component, OnInit } from '@angular/core';
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
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart-item.model';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    ButtonModule, InputTextModule, DropdownModule,
    StepsModule, DividerModule, RadioButtonModule, ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast position="bottom-right"></p-toast>
    <div class="pt-20 min-h-screen bg-cream page-enter">

      <!-- Redirect if empty cart -->
      <div *ngIf="cartItems.length === 0 && step < 3" class="container-custom py-24 text-center">
        <i class="pi pi-shopping-bag text-5xl text-gray-200 mb-5 block"></i>
        <h2 class="font-heading text-3xl text-charcoal mb-3">Votre panier est vide</h2>
        <a routerLink="/boutique">
          <button pButton label="Voir la boutique"
            style="background: #5a8a4a; border: none; border-radius: 2rem; margin-top: 1rem;">
          </button>
        </a>
      </div>

      <div *ngIf="cartItems.length > 0 || step === 3">

        <!-- Header -->
        <div class="bg-white border-b border-gray-100">
          <div class="container-custom py-8">
            <h1 class="font-heading text-4xl text-charcoal mb-6">Finaliser ma commande</h1>
            <!-- Steps -->
            <p-steps [model]="steps" [activeIndex]="step" [readonly]="true"></p-steps>
          </div>
        </div>

        <div class="container-custom py-12">
          <div class="flex flex-col lg:flex-row gap-10">

            <!-- Main form area -->
            <div class="flex-1">

              <!-- ── ÉTAPE 0 : Informations ─────────────── -->
              <div *ngIf="step === 0" class="bg-white rounded-2xl shadow-sm p-8">
                <h2 class="font-heading text-2xl text-charcoal mb-6">Vos informations</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-charcoal">Prénom *</label>
                    <input pInputText [(ngModel)]="info.firstName" placeholder="Marie" class="rounded-xl" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-charcoal">Nom *</label>
                    <input pInputText [(ngModel)]="info.lastName" placeholder="Dupont" class="rounded-xl" />
                  </div>
                  <div class="flex flex-col gap-2 sm:col-span-2">
                    <label class="text-sm font-medium text-charcoal">Email *</label>
                    <input pInputText type="email" [(ngModel)]="info.email" placeholder="marie@exemple.fr" class="rounded-xl" />
                  </div>
                  <div class="flex flex-col gap-2 sm:col-span-2">
                    <label class="text-sm font-medium text-charcoal">Téléphone</label>
                    <input pInputText type="tel" [(ngModel)]="info.phone" placeholder="+33 6 00 00 00 00" class="rounded-xl" />
                  </div>
                </div>
                <div class="flex justify-end mt-8">
                  <button pButton
                    label="Continuer → Livraison"
                    icon="pi pi-arrow-right" iconPos="right"
                    (click)="nextStep()"
                    style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.85rem 2rem;">
                  </button>
                </div>
              </div>

              <!-- ── ÉTAPE 1 : Livraison ────────────────── -->
              <div *ngIf="step === 1" class="bg-white rounded-2xl shadow-sm p-8">
                <h2 class="font-heading text-2xl text-charcoal mb-6">Adresse de livraison</h2>
                <div class="space-y-5">
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-charcoal">Adresse *</label>
                    <input pInputText [(ngModel)]="delivery.address" placeholder="12 rue des Lilas" class="rounded-xl" />
                  </div>
                  <div class="grid grid-cols-2 gap-5">
                    <div class="flex flex-col gap-2">
                      <label class="text-sm font-medium text-charcoal">Code postal *</label>
                      <input pInputText [(ngModel)]="delivery.zip" placeholder="75004" class="rounded-xl" />
                    </div>
                    <div class="flex flex-col gap-2">
                      <label class="text-sm font-medium text-charcoal">Ville *</label>
                      <input pInputText [(ngModel)]="delivery.city" placeholder="Paris" class="rounded-xl" />
                    </div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-charcoal">Instructions (optionnel)</label>
                    <input pInputText [(ngModel)]="delivery.notes" placeholder="Code porte, étage..." class="rounded-xl" />
                  </div>
                </div>

                <!-- Shipping method -->
                <h3 class="font-semibold text-charcoal mt-8 mb-4">Mode de livraison</h3>
                <div class="space-y-3">
                  <label *ngFor="let method of shippingMethods"
                    class="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all"
                    [class.border-primary-green]="delivery.method === method.value"
                    [class.bg-green-50]="delivery.method === method.value"
                    [class.border-gray-200]="delivery.method !== method.value">
                    <p-radioButton
                      [value]="method.value"
                      [(ngModel)]="delivery.method"
                      [name]="'shipping'"
                    ></p-radioButton>
                    <div class="flex-1">
                      <div class="flex items-center justify-between">
                        <span class="font-medium text-charcoal">{{ method.label }}</span>
                        <span class="font-bold" [class.text-primary-green]="method.price === 0">
                          {{ method.price === 0 ? 'Offert' : method.price + '€' }}
                        </span>
                      </div>
                      <p class="text-xs text-gray-500 mt-0.5">{{ method.description }}</p>
                    </div>
                  </label>
                </div>

                <div class="flex justify-between mt-8">
                  <button pButton label="Retour" icon="pi pi-arrow-left" class="p-button-text"
                    style="color: #5a8a4a;" (click)="step = 0">
                  </button>
                  <button pButton label="Continuer → Paiement"
                    icon="pi pi-arrow-right" iconPos="right"
                    (click)="nextStep()"
                    style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.85rem 2rem;">
                  </button>
                </div>
              </div>

              <!-- ── ÉTAPE 2 : Paiement ─────────────────── -->
              <div *ngIf="step === 2" class="bg-white rounded-2xl shadow-sm p-8">
                <h2 class="font-heading text-2xl text-charcoal mb-2">Paiement</h2>
                <p class="text-sm text-gray-500 flex items-center gap-2 mb-6">
                  <i class="pi pi-lock text-primary-green"></i>
                  Paiement sécurisé — vos données sont chiffrées
                </p>

                <div class="space-y-5">
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-charcoal">Numéro de carte</label>
                    <div class="relative">
                      <input pInputText
                        [(ngModel)]="payment.cardNumber"
                        placeholder="1234 5678 9012 3456"
                        maxlength="19"
                        class="rounded-xl w-full pr-12"
                        (input)="formatCard()"
                      />
                      <i class="pi pi-credit-card absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-charcoal">Nom sur la carte</label>
                    <input pInputText [(ngModel)]="payment.cardName" placeholder="MARIE DUPONT" class="rounded-xl" />
                  </div>
                  <div class="grid grid-cols-2 gap-5">
                    <div class="flex flex-col gap-2">
                      <label class="text-sm font-medium text-charcoal">Date d'expiration</label>
                      <input pInputText [(ngModel)]="payment.expiry" placeholder="MM/AA" maxlength="5" class="rounded-xl" />
                    </div>
                    <div class="flex flex-col gap-2">
                      <label class="text-sm font-medium text-charcoal">CVV</label>
                      <input pInputText type="password" [(ngModel)]="payment.cvv" placeholder="•••" maxlength="3" class="rounded-xl" />
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-4 mt-6 p-4 bg-gray-50 rounded-xl">
                  <i class="pi pi-shield text-2xl text-primary-green"></i>
                  <p class="text-xs text-gray-500">
                    Ceci est une démonstration. Aucune transaction réelle n'est effectuée.
                  </p>
                </div>

                <div class="flex justify-between mt-8">
                  <button pButton label="Retour" icon="pi pi-arrow-left" class="p-button-text"
                    style="color: #5a8a4a;" (click)="step = 1">
                  </button>
                  <button pButton
                    label="Confirmer la commande"
                    icon="pi pi-check"
                    [loading]="processing"
                    (click)="placeOrder()"
                    style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.85rem 2rem;">
                  </button>
                </div>
              </div>

              <!-- ── ÉTAPE 3 : Confirmation ─────────────── -->
              <div *ngIf="step === 3" class="bg-white rounded-2xl shadow-sm p-10 text-center">
                <div class="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                  <i class="pi pi-check-circle text-4xl text-primary-green"></i>
                </div>
                <h2 class="font-heading text-3xl text-charcoal font-bold mb-3">Commande confirmée !</h2>
                <p class="text-gray-500 mb-2">
                  Merci <strong>{{ info.firstName }}</strong> pour votre commande.
                </p>
                <p class="text-gray-500 mb-8">
                  Un email de confirmation a été envoyé à <strong>{{ info.email }}</strong>.
                </p>

                <!-- Order summary -->
                <div class="bg-green-50 rounded-2xl p-6 text-left mb-8 max-w-md mx-auto">
                  <p class="text-sm font-semibold text-primary-green mb-3">
                    Commande #{{ orderNumber }}
                  </p>
                  <div *ngFor="let item of confirmedItems" class="flex items-center gap-3 mb-3">
                    <img [src]="item.product.images[0]" [alt]="item.product.name"
                      class="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div class="flex-1 text-sm">
                      <p class="font-medium text-charcoal">{{ item.product.name }}</p>
                      <p class="text-gray-500">{{ item.quantity }}× {{ item.product.price }}€</p>
                    </div>
                  </div>
                  <p-divider></p-divider>
                  <div class="flex justify-between font-bold text-charcoal">
                    <span>Total payé</span>
                    <span class="text-primary-green">{{ confirmedTotal }}€</span>
                  </div>
                </div>

                <div class="flex flex-wrap gap-4 justify-center">
                  <a routerLink="/">
                    <button pButton label="Retour à l'accueil" icon="pi pi-home"
                      style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.85rem 2rem;">
                    </button>
                  </a>
                  <a routerLink="/boutique">
                    <button pButton label="Continuer mes achats" icon="pi pi-shopping-bag"
                      class="p-button-outlined"
                      style="border-color: #5a8a4a; color: #5a8a4a; border-radius: 2rem; padding: 0.85rem 2rem;">
                    </button>
                  </a>
                </div>
              </div>

            </div>

            <!-- Order summary sidebar -->
            <div *ngIf="step < 3" class="lg:w-80 flex-shrink-0">
              <div class="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h3 class="font-heading text-lg text-charcoal font-semibold mb-4">Votre commande</h3>

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
                    <span class="text-sm font-bold text-charcoal flex-shrink-0">{{ item.product.price * item.quantity }}€</span>
                  </div>
                </div>

                <p-divider></p-divider>

                <div class="space-y-2 text-sm mb-4">
                  <div class="flex justify-between text-gray-500">
                    <span>Sous-total</span>
                    <span>{{ cartService.getSubtotal() }}€</span>
                  </div>
                  <div class="flex justify-between text-gray-500">
                    <span>Livraison</span>
                    <span *ngIf="shippingCost > 0">{{ shippingCost }}€</span>
                    <span *ngIf="shippingCost === 0" class="text-primary-green font-medium">Offerte</span>
                  </div>
                </div>

                <div class="flex justify-between font-bold">
                  <span class="text-charcoal">Total</span>
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
export class CheckoutComponent implements OnInit {
  step = 0;
  processing = false;
  orderNumber = '';
  confirmedItems: CartItem[] = [];
  confirmedTotal = 0;

  steps: MenuItem[] = [
    { label: 'Informations' },
    { label: 'Livraison' },
    { label: 'Paiement' },
    { label: 'Confirmation' },
  ];

  info = { firstName: '', lastName: '', email: '', phone: '' };

  delivery = {
    address: '',
    zip: '',
    city: '',
    notes: '',
    method: 'standard'
  };

  payment = { cardNumber: '', cardName: '', expiry: '', cvv: '' };

  shippingMethods = [
    {
      value: 'standard',
      label: 'Livraison standard',
      description: 'Sous 3–5 jours ouvrés',
      price: 6.9
    },
    {
      value: 'express',
      label: 'Livraison express',
      description: 'Le lendemain avant 13h',
      price: 12.9
    },
    {
      value: 'free',
      label: 'Retrait en boutique',
      description: '12 Rue des Fleurs, Paris 4e',
      price: 0
    }
  ];

  get cartItems() {
    return this.cartService.cartItems();
  }

  get shippingCost(): number {
    const method = this.shippingMethods.find(m => m.value === this.delivery.method);
    if (!method || method.price === 0) return 0;
    return this.cartService.getSubtotal() >= 80 ? 0 : method.price;
  }

  constructor(
    public cartService: CartService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.orderNumber = 'BS-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/connexion'], { queryParams: { returnUrl: '/commande' } });
    }
  }

  nextStep() {
    if (this.step === 0 && (!this.info.firstName || !this.info.email)) {
      this.messageService.add({ severity: 'warn', summary: 'Champs requis', detail: 'Veuillez remplir les champs obligatoires.' });
      return;
    }
    if (this.step === 1 && (!this.delivery.address || !this.delivery.zip || !this.delivery.city)) {
      this.messageService.add({ severity: 'warn', summary: 'Champs requis', detail: 'Veuillez saisir votre adresse de livraison.' });
      return;
    }
    this.step++;
  }

  formatCard() {
    let v = this.payment.cardNumber.replace(/\D/g, '').substring(0, 16);
    this.payment.cardNumber = v.replace(/(.{4})/g, '$1 ').trim();
  }

  placeOrder() {
    if (!this.payment.cardNumber || !this.payment.cardName) {
      this.messageService.add({ severity: 'warn', summary: 'Champs requis', detail: 'Veuillez compléter les informations de paiement.' });
      return;
    }
    this.processing = true;
    this.confirmedItems = [...this.cartService.cartItems()];
    this.confirmedTotal = this.cartService.getSubtotal() + this.shippingCost;

    const orderPayload = {
      firstName: this.info.firstName,
      lastName: this.info.lastName,
      email: this.info.email,
      phone: this.info.phone,
      shippingAddress: this.delivery.address,
      shippingZip: this.delivery.zip,
      shippingCity: this.delivery.city,
      shippingNotes: this.delivery.notes,
      shippingMethod: this.delivery.method,
      shippingCost: this.shippingCost,
      items: this.cartService.cartItems().map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price
      })),
      totalAmount: this.confirmedTotal
    };

    this.http.post<{ id: number; orderNumber: string }>(`${environment.apiUrl}/orders`, orderPayload).subscribe({
      next: (order) => {
        this.processing = false;
        this.orderNumber = order.orderNumber || this.orderNumber;
        this.cartService.clearCart();
        this.step = 3;
      },
      error: () => {
        this.processing = false;
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de passer la commande. Veuillez réessayer.' });
      }
    });
  }
}
