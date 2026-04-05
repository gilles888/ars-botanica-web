import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'boutique',
    loadComponent: () => import('./pages/shop/shop.component').then(m => m.ShopComponent)
  },
  {
    path: 'boutique/:slug',
    loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'a-propos',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'panier',
    loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'commande',
    loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'commande/success',
    loadComponent: () => import('./pages/payment-success/payment-success.component').then(m => m.PaymentSuccessComponent)
  },
  {
    path: 'commande/annuler',
    loadComponent: () => import('./pages/payment-cancel/payment-cancel.component').then(m => m.PaymentCancelComponent)
  },
  {
    path: 'mes-commandes',
    loadComponent: () => import('./pages/mes-commandes/mes-commandes.component').then(m => m.MesCommandesComponent)
  },
  {
    path: 'connexion',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'inscription',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: 'admin/ventes',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/sales/sales.component').then(m => m.SalesComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
