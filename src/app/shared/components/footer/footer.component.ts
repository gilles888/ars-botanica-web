import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, InputTextModule, FormsModule, ToastModule, TranslateModule],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <footer class="bg-charcoal text-white">
      <!-- Newsletter band -->
      <div class="bg-primary-green py-12">
        <div class="container-custom text-center">
          <p class="text-green-100 text-sm uppercase tracking-widest mb-2">{{ 'footer.newsletter_label' | translate }}</p>
          <h3 class="font-heading text-3xl text-white mb-3">{{ 'footer.newsletter_title' | translate }}</h3>
          <p class="text-green-100 mb-8 max-w-md mx-auto">
            {{ 'footer.newsletter_desc' | translate }}
          </p>
          <form (ngSubmit)="subscribe()" class="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              pInputText
              type="email"
              [(ngModel)]="email"
              name="email"
              [placeholder]="'footer.newsletter_placeholder' | translate"
              class="flex-1 rounded-full px-5 py-3 text-charcoal border-0 outline-none"
              style="background: white; color: #2d3748;"
            />
            <button
              pButton
              type="submit"
              [label]="'footer.newsletter_btn' | translate"
              style="background: #2d3748; border: none; border-radius: 2rem; padding: 0.75rem 1.75rem;"
            ></button>
          </form>
        </div>
      </div>

      <!-- Main footer -->
      <div class="container-custom py-16">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10">

          <!-- Brand -->
          <div class="md:col-span-1">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-9 h-9 rounded-full bg-primary-green flex items-center justify-center">
                <i class="pi pi-heart text-white text-sm"></i>
              </div>
              <span class="font-heading text-xl font-semibold">Ars Botanica</span>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed mb-5">
              {{ 'footer.brand_desc' | translate }}
            </p>
            <div class="flex gap-3">
              <a *ngFor="let social of socials"
                [href]="social.url"
                target="_blank"
                class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-green transition-colors"
                [attr.aria-label]="social.name">
                <i [class]="social.icon + ' text-sm'"></i>
              </a>
            </div>
          </div>

          <!-- Navigation -->
          <div>
            <h4 class="font-semibold text-white mb-4 uppercase tracking-wider text-xs">{{ 'footer.navigation' | translate }}</h4>
            <ul class="space-y-2">
              <li *ngFor="let link of footerLinks">
                <a [routerLink]="link.path"
                  class="text-gray-400 hover:text-white transition-colors text-sm">
                  {{ link.labelKey | translate }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Services -->
          <div>
            <h4 class="font-semibold text-white mb-4 uppercase tracking-wider text-xs">{{ 'footer.services' | translate }}</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li>{{ 'footer.service_custom' | translate }}</li>
              <li>{{ 'footer.service_events' | translate }}</li>
              <li>{{ 'footer.service_wedding' | translate }}</li>
              <li>{{ 'footer.service_subscription' | translate }}</li>
              <li>{{ 'footer.service_delivery' | translate }}</li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="font-semibold text-white mb-4 uppercase tracking-wider text-xs">{{ 'footer.find_us' | translate }}</h4>
            <ul class="space-y-3 text-sm">
              <li class="flex items-start gap-3 text-gray-400">
                <i class="pi pi-map-marker text-primary-green mt-0.5 flex-shrink-0"></i>
                <span>12 Rue des Fleurs<br>75004 Paris</span>
              </li>
              <li class="flex items-center gap-3 text-gray-400">
                <i class="pi pi-phone text-primary-green flex-shrink-0"></i>
                <span>+33 1 42 00 00 00</span>
              </li>
              <li class="flex items-center gap-3 text-gray-400">
                <i class="pi pi-envelope text-primary-green flex-shrink-0"></i>
                <span>bonjour&#64;ars-botanica.fr</span>
              </li>
              <li class="flex items-start gap-3 text-gray-400">
                <i class="pi pi-clock text-primary-green mt-0.5 flex-shrink-0"></i>
                <span [innerHTML]="'footer.hours' | translate"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-white/10">
        <div class="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p class="text-gray-500 text-xs">
            © {{ currentYear }} Ars Botanica. {{ 'footer.copyright' | translate }}
          </p>
          <div class="flex gap-5 text-xs text-gray-500">
            <a href="#" class="hover:text-white transition-colors">{{ 'footer.legal' | translate }}</a>
            <a href="#" class="hover:text-white transition-colors">{{ 'footer.privacy' | translate }}</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  email = '';
  currentYear = new Date().getFullYear();

  socials = [
    { name: 'Instagram', icon: 'pi pi-instagram', url: '#' },
    { name: 'Facebook', icon: 'pi pi-facebook', url: '#' },
    { name: 'Pinterest', icon: 'pi pi-map', url: '#' },
  ];

  footerLinks = [
    { labelKey: 'nav.home', path: '/' },
    { labelKey: 'nav.shop', path: '/boutique' },
    { labelKey: 'nav.about', path: '/a-propos' },
    { labelKey: 'nav.contact', path: '/contact' },
  ];

  constructor(
    private messageService: MessageService,
    private translate: TranslateService
  ) {}

  subscribe() {
    if (this.email) {
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('footer.subscribed'),
        detail: this.translate.instant('footer.subscribed_detail')
      });
      this.email = '';
    }
  }
}
