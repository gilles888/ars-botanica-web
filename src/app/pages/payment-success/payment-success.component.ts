import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TranslateModule],
  template: `
    <div class="pt-20 min-h-screen bg-cream flex items-center justify-center page-enter">
      <div class="bg-white rounded-2xl shadow-sm p-12 text-center max-w-lg w-full mx-4">
        <div class="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
          <i class="pi pi-check-circle text-5xl text-primary-green"></i>
        </div>
        <h1 class="font-heading text-4xl text-charcoal font-bold mb-3">{{ 'payment.success_title' | translate }}</h1>
        <p class="text-gray-500 mb-2">{{ 'payment.success_desc1' | translate }}</p>
        <p class="text-gray-500 mb-8">{{ 'payment.success_desc2' | translate }}</p>

        <div class="flex flex-wrap gap-4 justify-center">
          <a routerLink="/">
            <button pButton [label]="'payment.back_home' | translate" icon="pi pi-home"
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
export class PaymentSuccessComponent {}
