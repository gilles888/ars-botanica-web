import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart-item.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    ButtonModule, TableModule, DividerModule, ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast position="bottom-right"></p-toast>
    <div class="pt-20 min-h-screen bg-cream page-enter">

      <!-- Header -->
      <div class="bg-white border-b border-gray-100">
        <div class="container-custom py-10">
          <h1 class="font-heading text-4xl text-charcoal">Mon Panier</h1>
          <p class="text-gray-500 mt-2">
            {{ cartService.cartCount() }} article{{ cartService.cartCount() > 1 ? 's' : '' }}
          </p>
        </div>
      </div>

      <div class="container-custom py-12">

        <!-- Empty state -->
        <div *ngIf="cartService.cartCount() === 0" class="text-center py-24">
          <div class="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <i class="pi pi-shopping-bag text-4xl text-primary-green"></i>
          </div>
          <h2 class="font-heading text-3xl text-charcoal mb-3">Votre panier est vide</h2>
          <p class="text-gray-500 mb-8">Découvrez nos créations florales et ajoutez vos favoris.</p>
          <a routerLink="/boutique">
            <button pButton
              label="Voir la boutique"
              icon="pi pi-arrow-right" iconPos="right"
              style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.85rem 2rem;">
            </button>
          </a>
        </div>

        <!-- Cart content -->
        <div *ngIf="cartService.cartCount() > 0" class="flex flex-col lg:flex-row gap-10">

          <!-- Items list -->
          <div class="flex-1">
            <div class="bg-white rounded-2xl shadow-sm overflow-hidden">

              <!-- Header row -->
              <div class="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-widest text-gray-400 font-semibold">
                <div class="col-span-6">Produit</div>
                <div class="col-span-2 text-center">Prix</div>
                <div class="col-span-2 text-center">Quantité</div>
                <div class="col-span-2 text-right">Total</div>
              </div>

              <!-- Items -->
              <div *ngFor="let item of cartService.cartItems(); let last = last">
                <div class="grid grid-cols-12 gap-4 items-center px-6 py-5"
                  [class.border-b]="!last"
                  [class.border-gray-100]="!last">

                  <!-- Image + name -->
                  <div class="col-span-12 md:col-span-6 flex items-center gap-4">
                    <a [routerLink]="['/boutique', item.product.slug]"
                      class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img [src]="item.product.images[0]" [alt]="item.product.name"
                        class="w-full h-full object-cover hover:scale-105 transition-transform" />
                    </a>
                    <div>
                      <a [routerLink]="['/boutique', item.product.slug]"
                        class="font-heading text-base font-semibold text-charcoal hover:text-primary-green transition-colors line-clamp-2">
                        {{ item.product.name }}
                      </a>
                      <p class="text-xs text-gray-400 mt-1 capitalize">{{ item.product.category }}</p>
                    </div>
                  </div>

                  <!-- Unit price -->
                  <div class="col-span-4 md:col-span-2 text-center">
                    <span class="md:hidden text-xs text-gray-400 block mb-1">Prix unit.</span>
                    <span class="font-semibold text-charcoal">{{ item.product.price }}€</span>
                  </div>

                  <!-- Quantity -->
                  <div class="col-span-4 md:col-span-2 flex items-center justify-center">
                    <div class="flex items-center border border-gray-200 rounded-full">
                      <button
                        class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary-green transition-colors font-bold rounded-l-full hover:bg-gray-50"
                        (click)="updateQty(item, item.quantity - 1)">−</button>
                      <span class="w-8 text-center text-sm font-semibold">{{ item.quantity }}</span>
                      <button
                        class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary-green transition-colors font-bold rounded-r-full hover:bg-gray-50"
                        (click)="updateQty(item, item.quantity + 1)">+</button>
                    </div>
                  </div>

                  <!-- Total + remove -->
                  <div class="col-span-4 md:col-span-2 flex items-center justify-end gap-3">
                    <span class="font-bold text-primary-green">{{ item.product.price * item.quantity }}€</span>
                    <button
                      class="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                      (click)="removeItem(item)"
                      title="Supprimer">
                      <i class="pi pi-times text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions bottom -->
            <div class="flex items-center justify-between mt-4">
              <a routerLink="/boutique">
                <button pButton
                  label="Continuer mes achats"
                  icon="pi pi-arrow-left"
                  class="p-button-text"
                  style="color: #5a8a4a; font-size: 0.875rem;">
                </button>
              </a>
              <button pButton
                label="Vider le panier"
                icon="pi pi-trash"
                class="p-button-text p-button-danger"
                style="font-size: 0.875rem;"
                (click)="clearCart()">
              </button>
            </div>
          </div>

          <!-- Order summary -->
          <div class="lg:w-80 flex-shrink-0">
            <div class="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 class="font-heading text-xl text-charcoal font-semibold mb-5">Récapitulatif</h2>

              <div class="space-y-3 text-sm mb-5">
                <div class="flex justify-between">
                  <span class="text-gray-500">Sous-total</span>
                  <span class="font-medium">{{ cartService.getSubtotal() }}€</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Livraison</span>
                  <span *ngIf="cartService.getShipping() > 0" class="font-medium">{{ cartService.getShipping() }}€</span>
                  <span *ngIf="cartService.getShipping() === 0" class="text-primary-green font-semibold">Offerte</span>
                </div>
                <p *ngIf="cartService.getShipping() > 0" class="text-xs text-gray-400">
                  Livraison offerte dès 80€ d'achat
                  <span class="text-primary-green font-medium">
                    (encore {{ 80 - cartService.getSubtotal() }}€)
                  </span>
                </p>
              </div>

              <p-divider></p-divider>

              <div class="flex justify-between items-center mb-6">
                <span class="font-semibold text-charcoal">Total</span>
                <span class="text-2xl font-bold text-primary-green">{{ cartService.getTotal() }}€</span>
              </div>

              <a routerLink="/commande" class="block">
                <button pButton
                  label="Passer la commande"
                  icon="pi pi-arrow-right" iconPos="right"
                  class="w-full"
                  style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.9rem; font-size: 1rem;">
                </button>
              </a>

              <!-- Trust badges -->
              <div class="mt-6 space-y-2">
                <div *ngFor="let trust of trustBadges" class="flex items-center gap-2 text-xs text-gray-500">
                  <i [class]="trust.icon + ' text-primary-green'"></i>
                  <span>{{ trust.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CartComponent {
  trustBadges = [
    { icon: 'pi pi-lock', label: 'Paiement 100% sécurisé' },
    { icon: 'pi pi-truck', label: 'Livraison soignée à domicile' },
    { icon: 'pi pi-refresh', label: 'Retour sous 48h' },
  ];

  constructor(
    public cartService: CartService,
    private messageService: MessageService
  ) {}

  updateQty(item: CartItem, qty: number): void {
    this.cartService.updateQuantity(item.product.id, qty);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.product.id);
    this.messageService.add({
      severity: 'info',
      summary: 'Retiré du panier',
      detail: item.product.name,
      life: 2000
    });
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
