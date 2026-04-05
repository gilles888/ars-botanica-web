import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/services/auth.service';
import { CommandesService } from '../../core/api/generated/api/commandes.service';
import { OrderResponse, OrderResponseStatusEnum } from '../../core/api/generated/model/order-response';

/** Configuration visuelle d'un badge de statut de commande */
interface BadgeStatut {
  label: string;
  classes: string;
}

@Component({
  selector: 'app-mes-commandes',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule],
  template: `
    <div class="pt-24 pb-16 min-h-screen bg-cream page-enter">
      <div class="container-custom max-w-4xl">

        <!-- En-tête de la page -->
        <div class="mb-8">
          <p class="text-sm font-medium tracking-widest uppercase mb-2" style="color: #5a8a4a;">Mon compte</p>
          <h1 class="font-heading text-4xl font-bold text-charcoal">Mes commandes</h1>
        </div>

        <!-- Chargement -->
        <div *ngIf="chargement" class="flex flex-col items-center justify-center py-24 text-gray-400">
          <i class="pi pi-spin pi-spinner text-4xl mb-4"></i>
          <p class="text-sm">Chargement de vos commandes...</p>
        </div>

        <!-- Erreur -->
        <div *ngIf="!chargement && erreur"
          class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <i class="pi pi-exclamation-triangle text-4xl text-red-400 mb-3 block"></i>
          <p class="text-red-600 font-medium">Impossible de charger vos commandes.</p>
          <p class="text-red-400 text-sm mt-1">Veuillez réessayer ultérieurement.</p>
          <button pButton label="Réessayer" icon="pi pi-refresh"
            class="mt-4"
            style="background: #5a8a4a; border: none; border-radius: 2rem;"
            (click)="chargerCommandes()">
          </button>
        </div>

        <!-- Liste vide -->
        <div *ngIf="!chargement && !erreur && commandes.length === 0"
          class="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div class="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <i class="pi pi-shopping-bag text-4xl" style="color: #5a8a4a;"></i>
          </div>
          <h2 class="font-heading text-2xl font-bold text-charcoal mb-2">Aucune commande pour l'instant</h2>
          <p class="text-gray-500 mb-6">Découvrez notre boutique et passez votre première commande !</p>
          <a routerLink="/boutique">
            <button pButton label="Voir la boutique" icon="pi pi-arrow-right"
              style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.85rem 2rem;">
            </button>
          </a>
        </div>

        <!-- Liste des commandes -->
        <div *ngIf="!chargement && !erreur && commandes.length > 0" class="flex flex-col gap-4">
          <div *ngFor="let commande of commandes"
            class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">

            <!-- En-tête de la carte commande -->
            <div class="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div class="flex flex-wrap items-center gap-4">
                <!-- Numéro de commande -->
                <div>
                  <p class="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Commande</p>
                  <p class="font-semibold text-charcoal font-mono text-sm">
                    {{ commande.orderNumber || '#' + commande.id }}
                  </p>
                </div>
                <!-- Date -->
                <div>
                  <p class="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Date</p>
                  <p class="font-medium text-charcoal text-sm">
                    {{ formatDate(commande.createdAt) }}
                  </p>
                </div>
                <!-- Nombre d'articles -->
                <div>
                  <p class="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Articles</p>
                  <p class="font-medium text-charcoal text-sm">
                    {{ nombreArticles(commande) }}
                  </p>
                </div>
              </div>

              <!-- Badge statut + montant total -->
              <div class="flex items-center gap-4">
                <span class="px-3 py-1 rounded-full text-xs font-semibold"
                  [ngClass]="getBadgeStatut(commande.status).classes">
                  {{ getBadgeStatut(commande.status).label }}
                </span>
                <p class="font-bold text-charcoal text-lg">
                  {{ commande.total | number:'1.2-2' }} €
                </p>
              </div>
            </div>

            <!-- Corps de la carte : articles et adresse -->
            <div class="px-6 py-4">

              <!-- Liste des articles -->
              <div class="mb-4" *ngIf="commande.items && commande.items.length > 0">
                <p class="text-xs text-gray-400 uppercase tracking-wide mb-2">Articles commandés</p>
                <div class="flex flex-col gap-2">
                  <div *ngFor="let article of commande.items"
                    class="flex items-center justify-between text-sm text-charcoal">
                    <div class="flex items-center gap-2">
                      <!-- Image produit si disponible -->
                      <img *ngIf="article.productImage"
                        [src]="article.productImage" [alt]="article.productName"
                        class="w-10 h-10 rounded-lg object-cover border border-gray-100">
                      <div *ngIf="!article.productImage"
                        class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center border border-gray-100">
                        <i class="pi pi-image text-gray-300 text-sm"></i>
                      </div>
                      <span class="font-medium">{{ article.productName }}</span>
                      <span class="text-gray-400 text-xs" *ngIf="article.size">— {{ article.size }}</span>
                    </div>
                    <div class="flex items-center gap-3 text-gray-500">
                      <span>x{{ article.quantity }}</span>
                      <span class="font-semibold text-charcoal">{{ article.subtotal | number:'1.2-2' }} €</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Adresse de livraison -->
              <div *ngIf="commande.deliveryAddress"
                class="flex items-start gap-2 text-sm text-gray-500 pt-3 border-t border-gray-100">
                <i class="pi pi-map-marker mt-0.5" style="color: #5a8a4a;"></i>
                <div>
                  <p class="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Livraison</p>
                  <p>{{ commande.deliveryAddress }}, {{ commande.deliveryZip }} {{ commande.deliveryCity }}</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Lien retour boutique -->
        <div class="mt-8 text-center" *ngIf="!chargement && !erreur && commandes.length > 0">
          <a routerLink="/boutique" class="text-sm font-medium hover:underline" style="color: #5a8a4a;">
            <i class="pi pi-arrow-left mr-1"></i>
            Continuer mes achats
          </a>
        </div>

      </div>
    </div>
  `
})
export class MesCommandesComponent implements OnInit {
  /** Liste des commandes de l'utilisateur */
  commandes: OrderResponse[] = [];
  /** Indicateur de chargement */
  chargement = true;
  /** Indicateur d'erreur */
  erreur = false;

  constructor(
    private authService: AuthService,
    private commandesService: CommandesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirection vers la page de connexion si l'utilisateur n'est pas authentifié
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/connexion']);
      return;
    }
    this.chargerCommandes();
  }

  /** Charge les commandes de l'utilisateur connecté via l'API */
  chargerCommandes(): void {
    this.chargement = true;
    this.erreur = false;

    this.commandesService.getMyOrders().subscribe({
      next: (commandes) => {
        // Tri des commandes par date décroissante (plus récentes en premier)
        this.commandes = commandes.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        this.chargement = false;
      },
      error: () => {
        this.erreur = true;
        this.chargement = false;
      }
    });
  }

  /**
   * Retourne la configuration du badge coloré selon le statut de la commande.
   * Couleurs : PAYMENT_PENDING=orange, PAID=vert, SHIPPED=bleu, DELIVERED=gris, CANCELLED=rouge
   */
  getBadgeStatut(status?: OrderResponseStatusEnum): BadgeStatut {
    switch (status) {
      case OrderResponseStatusEnum.PAYMENT_PENDING:
        return { label: 'En attente de paiement', classes: 'bg-orange-100 text-orange-700' };
      case OrderResponseStatusEnum.PAID:
        return { label: 'Payée', classes: 'bg-green-100 text-green-700' };
      case OrderResponseStatusEnum.PENDING:
        return { label: 'En attente', classes: 'bg-yellow-100 text-yellow-700' };
      case OrderResponseStatusEnum.CONFIRMED:
        return { label: 'Confirmée', classes: 'bg-blue-100 text-blue-700' };
      case OrderResponseStatusEnum.PREPARING:
        return { label: 'En préparation', classes: 'bg-purple-100 text-purple-700' };
      case OrderResponseStatusEnum.SHIPPED:
        return { label: 'Expédiée', classes: 'bg-blue-100 text-blue-700' };
      case OrderResponseStatusEnum.DELIVERED:
        return { label: 'Livrée', classes: 'bg-gray-100 text-gray-600' };
      case OrderResponseStatusEnum.CANCELLED:
        return { label: 'Annulée', classes: 'bg-red-100 text-red-600' };
      default:
        return { label: status ?? 'Inconnu', classes: 'bg-gray-100 text-gray-500' };
    }
  }

  /** Formate une date ISO en format lisible français */
  formatDate(dateIso?: string): string {
    if (!dateIso) return '—';
    return new Date(dateIso).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  /** Calcule le nombre total d'articles d'une commande */
  nombreArticles(commande: OrderResponse): string {
    const total = commande.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ?? 0;
    return total === 1 ? '1 article' : `${total} articles`;
  }
}
