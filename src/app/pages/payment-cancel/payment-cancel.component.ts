import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-cancel',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TranslateModule],
  template: `
    <div class="pt-20 min-h-screen bg-cream flex items-center justify-center page-enter">
      <div class="bg-white rounded-2xl shadow-sm p-12 text-center max-w-lg w-full mx-4">
        <div class="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-6">
          <i class="pi pi-times-circle text-5xl text-orange-400"></i>
        </div>
        <h1 class="font-heading text-4xl text-charcoal font-bold mb-3">{{ 'payment.cancel_title' | translate }}</h1>
        <p class="text-gray-500 mb-8">{{ 'payment.cancel_desc' | translate }}</p>

        <div class="flex flex-wrap gap-4 justify-center">
          <a routerLink="/panier">
            <button pButton [label]="'payment.back_cart' | translate" icon="pi pi-shopping-cart"
              style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.85rem 2rem;">
            </button>
          </a>
          <a routerLink="/boutique">
            <button pButton [label]="'payment.continue_shopping' | translate" icon="pi pi-shopping-bag"
              class="p-button-outlined"
              style="border-color: #5a8a4a; color: #5a8a4a; border-radius: 2rem; padding: 0.85rem 2rem;">
            </button>
          </a>
        </div>
      </div>
    </div>
  `
})
export class PaymentCancelComponent {}
