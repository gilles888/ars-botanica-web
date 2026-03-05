import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, InputTextModule, FormsModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <footer class="bg-charcoal text-white">
      <!-- Newsletter band -->
      <div class="bg-primary-green py-12">
        <div class="container-custom text-center">
          <p class="text-green-100 text-sm uppercase tracking-widest mb-2">Newsletter</p>
          <h3 class="font-heading text-3xl text-white mb-3">Des fleurs dans votre boîte mail</h3>
          <p class="text-green-100 mb-8 max-w-md mx-auto">
            Recevez nos offres saisonnières, conseils floraux et inspirations en exclusivité.
          </p>
          <form (ngSubmit)="subscribe()" class="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              pInputText
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="votre@email.com"
              class="flex-1 rounded-full px-5 py-3 text-charcoal border-0 outline-none"
              style="background: white; color: #2d3748;"
            />
            <button
              pButton
              type="submit"
              label="S'abonner"
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
              Créations florales artisanales depuis 2012. Chaque bouquet est une œuvre unique,
              réalisée avec passion et savoir-faire.
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
            <h4 class="font-semibold text-white mb-4 uppercase tracking-wider text-xs">Navigation</h4>
            <ul class="space-y-2">
              <li *ngFor="let link of footerLinks">
                <a [routerLink]="link.path"
                  class="text-gray-400 hover:text-white transition-colors text-sm">
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Services -->
          <div>
            <h4 class="font-semibold text-white mb-4 uppercase tracking-wider text-xs">Services</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li>Créations sur mesure</li>
              <li>Décorations événementielles</li>
              <li>Fleurs de mariage</li>
              <li>Abonnement floral</li>
              <li>Livraison à domicile</li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="font-semibold text-white mb-4 uppercase tracking-wider text-xs">Nous trouver</h4>
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
                <span>Mar–Sam : 9h–19h<br>Dim : 9h–13h</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-white/10">
        <div class="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p class="text-gray-500 text-xs">
            © {{ currentYear }} Ars Botanica. Tous droits réservés.
          </p>
          <div class="flex gap-5 text-xs text-gray-500">
            <a href="#" class="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" class="hover:text-white transition-colors">Politique de confidentialité</a>
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
    { label: 'Accueil', path: '/' },
    { label: 'Boutique', path: '/boutique' },
    { label: 'À propos', path: '/a-propos' },
    { label: 'Contact', path: '/contact' },
  ];

  constructor(private messageService: MessageService) {}

  subscribe() {
    if (this.email) {
      this.messageService.add({
        severity: 'success',
        summary: 'Abonné !',
        detail: 'Merci pour votre inscription à notre newsletter.'
      });
      this.email = '';
    }
  }
}
