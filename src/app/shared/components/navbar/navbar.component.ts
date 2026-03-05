import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuthUser } from '../../../core/models/auth-user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive, ButtonModule, BadgeModule],
  template: `
    <header
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      [class.scrolled]="isScrolled"
      [class.bg-white]="isScrolled || mobileOpen"
      [class.shadow-md]="isScrolled"
      [class.bg-transparent]="!isScrolled && !mobileOpen"
    >
      <div class="container-custom">
        <nav class="flex items-center justify-between h-20">

          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2 group">
            <div class="w-9 h-9 rounded-full bg-primary-green flex items-center justify-center">
              <i class="pi pi-heart text-white text-sm"></i>
            </div>
            <div>
              <span class="font-heading text-xl font-semibold text-charcoal group-hover:text-primary-green transition-colors">
                Ars
              </span>
              <span class="font-heading text-xl text-primary-green"> Botanica</span>
            </div>
          </a>

          <!-- Desktop Nav -->
          <ul class="hidden md:flex items-center gap-8">
            <li *ngFor="let link of navLinks">
              <a
                [routerLink]="link.path"
                routerLinkActive="text-primary-green font-semibold"
                [routerLinkActiveOptions]="{exact: link.exact}"
                class="text-charcoal hover:text-primary-green transition-colors font-medium text-sm tracking-wide"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>

          <!-- CTA + Cart + Auth -->
          <div class="hidden md:flex items-center gap-3">
            <!-- Cart icon -->
            <a routerLink="/panier" class="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-green-50 transition-colors">
              <i class="pi pi-shopping-bag text-lg text-charcoal"></i>
              <span *ngIf="cartService.cartCount() > 0"
                class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-pastel text-white text-xs flex items-center justify-center font-semibold">
                {{ cartService.cartCount() }}
              </span>
            </a>

            <!-- Auth: logged in -->
            <ng-container *ngIf="currentUser; else guestActions">
              <a routerLink="/compte"
                class="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-primary-green hover:bg-green-100 transition-colors text-sm font-medium">
                <i class="pi pi-user text-sm"></i>
                {{ currentUser.firstName }}
              </a>
              <button pButton
                label="Déconnexion"
                class="p-button-text p-button-sm"
                style="color: #5a8a4a; font-size: 0.875rem;"
                (click)="logout()">
              </button>
            </ng-container>

            <!-- Auth: guest -->
            <ng-template #guestActions>
              <a routerLink="/connexion">
                <button pButton
                  label="Connexion"
                  class="p-button-outlined p-button-sm"
                  style="border-color: #5a8a4a; color: #5a8a4a; border-radius: 2rem; font-size: 0.875rem;">
                </button>
              </a>
            </ng-template>
          </div>

          <!-- Mobile right actions -->
          <div class="md:hidden flex items-center gap-2">
            <a routerLink="/panier" class="relative flex items-center justify-center w-10 h-10">
              <i class="pi pi-shopping-bag text-xl text-charcoal"></i>
              <span *ngIf="cartService.cartCount() > 0"
                class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-pastel text-white text-xs flex items-center justify-center font-semibold">
                {{ cartService.cartCount() }}
              </span>
            </a>
            <button
              class="p-2 rounded-lg hover:bg-cream-dark transition-colors"
              (click)="toggleMobile()"
              aria-label="Toggle menu"
            >
              <i class="pi text-xl text-charcoal" [class.pi-bars]="!mobileOpen" [class.pi-times]="mobileOpen"></i>
            </button>
          </div>
        </nav>

        <!-- Mobile menu -->
        <div *ngIf="mobileOpen" class="md:hidden pb-4 border-t border-gray-100">
          <ul class="flex flex-col gap-1 pt-4">
            <li *ngFor="let link of navLinks">
              <a
                [routerLink]="link.path"
                routerLinkActive="text-primary-green bg-green-50"
                [routerLinkActiveOptions]="{exact: link.exact}"
                class="block px-4 py-3 rounded-lg text-charcoal hover:text-primary-green hover:bg-green-50 transition-colors font-medium"
                (click)="closeMobile()"
              >
                {{ link.label }}
              </a>
            </li>
            <li>
              <a routerLink="/panier" (click)="closeMobile()"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-charcoal hover:text-primary-green hover:bg-green-50 transition-colors font-medium">
                <i class="pi pi-shopping-bag"></i>
                Panier
                <span *ngIf="cartService.cartCount() > 0"
                  class="ml-auto bg-rose-pastel text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {{ cartService.cartCount() }}
                </span>
              </a>
            </li>
            <li *ngIf="currentUser">
              <a routerLink="/compte" (click)="closeMobile()"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-green hover:bg-green-50 transition-colors font-medium">
                <i class="pi pi-user"></i>
                {{ currentUser.firstName }}
              </a>
            </li>
            <li class="pt-3 px-4">
              <ng-container *ngIf="currentUser; else mobileGuest">
                <button pButton
                  label="Déconnexion"
                  (click)="logout(); closeMobile()"
                  class="w-full p-button-outlined p-button-sm"
                  style="border-color: #5a8a4a; color: #5a8a4a; border-radius: 2rem;">
                </button>
              </ng-container>
              <ng-template #mobileGuest>
                <a routerLink="/connexion" (click)="closeMobile()">
                  <button pButton
                    label="Connexion"
                    class="w-full p-button-sm"
                    style="background: #5a8a4a; border-color: #5a8a4a; border-radius: 2rem;">
                  </button>
                </a>
              </ng-template>
            </li>
          </ul>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host { display: block; }
    header.scrolled { backdrop-filter: blur(12px); }
  `]
})
export class NavbarComponent implements OnInit {
  isScrolled = false;
  mobileOpen = false;
  currentUser: AuthUser | null = null;

  navLinks = [
    { label: 'Accueil', path: '/', exact: true },
    { label: 'Boutique', path: '/boutique', exact: false },
    { label: 'À propos', path: '/a-propos', exact: false },
    { label: 'Contact', path: '/contact', exact: false },
  ];

  constructor(
    public cartService: CartService,
    private authService: AuthService
  ) {}

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  ngOnInit() {
    this.isScrolled = window.scrollY > 50;
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
  }

  toggleMobile() { this.mobileOpen = !this.mobileOpen; }
  closeMobile() { this.mobileOpen = false; }
}
