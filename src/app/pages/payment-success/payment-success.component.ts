import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription, interval } from 'rxjs';
import { take, switchMap, takeWhile } from 'rxjs/operators';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

/** Réponse de l'API /api/payments/session/{sessionId} */
interface SessionStatus {
  status: string;
  orderNumber?: string;
  customerEmail?: string;
}

/** États possibles de la vérification du paiement */
type EtatPaiement = 'chargement' | 'succes' | 'attente' | 'erreur';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonModule, InputTextModule, ToastModule, TranslateModule],
  providers: [MessageService],
  template: `
    <p-toast position="bottom-right"></p-toast>
    <div class="pt-20 min-h-screen bg-cream flex items-center justify-center page-enter">
      <div class="bg-white rounded-2xl shadow-sm p-12 text-center max-w-lg w-full mx-4">

        <!-- État : chargement initial -->
        <ng-container *ngIf="etat === 'chargement'">
          <div class="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <i class="pi pi-spin pi-spinner text-5xl text-primary-green"></i>
          </div>
          <h1 class="font-heading text-2xl text-charcoal font-bold mb-3">Vérification du paiement...</h1>
          <p class="text-gray-500 mb-2">Nous confirmons votre commande auprès de Stripe.</p>
          <p class="text-gray-400 text-sm">Tentative {{ tentative }} / {{ maxTentatives }}</p>
        </ng-container>

        <!-- État : succès -->
        <ng-container *ngIf="etat === 'succes'">
          <div class="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <i class="pi pi-check-circle text-5xl" style="color: #5a8a4a;"></i>
          </div>
          <h1 class="font-heading text-4xl text-charcoal font-bold mb-3">Paiement confirmé !</h1>
          <p class="text-gray-700 font-semibold mb-1" *ngIf="numeroCommande">
            Commande n° <span style="color: #5a8a4a;">{{ numeroCommande }}</span> reçue
          </p>
          <p class="text-gray-500 mb-2">Merci pour votre confiance.</p>
          <p class="text-gray-500 mb-8">Vous recevrez un email de confirmation à l'adresse indiquée.</p>

          <div class="flex flex-wrap gap-4 justify-center">
            <a routerLink="/">
              <button pButton label="Retour à l'accueil" icon="pi pi-home"
                style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.85rem 2rem;">
              </button>
            </a>
            <a routerLink="/mes-commandes">
              <button pButton label="Voir mes commandes" icon="pi pi-list"
                class="p-button-outlined"
                style="border-color: #5a8a4a; color: #5a8a4a; border-radius: 2rem; padding: 0.85rem 2rem;">
              </button>
            </a>
          </div>

          <!-- Création de compte invité -->
          <div *ngIf="isGuest && !accountCreated" class="mt-8 bg-gray-50 rounded-2xl p-6 text-left border border-gray-100">
            <h3 class="font-heading text-xl text-charcoal mb-2">{{ 'payment.create_account_title' | translate }}</h3>
            <p class="text-sm text-gray-600 mb-5">{{ 'payment.create_account_desc' | translate }}</p>
            <div class="space-y-4">
              <input pInputText type="password" [(ngModel)]="password"
                     [placeholder]="'payment.password' | translate"
                     class="w-full rounded-xl" />
              <input pInputText type="password" [(ngModel)]="confirmPassword"
                     [placeholder]="'payment.confirm_password' | translate"
                     class="w-full rounded-xl" />
              <button pButton [label]="'payment.create_account_btn' | translate"
                      (click)="convertGuestToUser()" [loading]="converting"
                      class="w-full"
                      style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.85rem 2rem;">
              </button>
              <div class="text-center">
                <a routerLink="/boutique" class="text-sm text-gray-500 hover:underline">{{ 'payment.skip' | translate }}</a>
              </div>
            </div>
          </div>
          <div *ngIf="isGuest && accountCreated" class="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
            <p class="text-sm text-green-700 font-medium">Compte créé avec succès ! Vous êtes maintenant connecté.</p>
            <a routerLink="/mes-commandes" class="text-sm text-primary-green hover:underline mt-1 inline-block">Voir mes commandes →</a>
          </div>
        </ng-container>

        <!-- État : attente (paiement en cours de traitement) -->
        <ng-container *ngIf="etat === 'attente'">
          <div class="w-24 h-24 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-6">
            <i class="pi pi-clock text-5xl text-yellow-500"></i>
          </div>
          <h1 class="font-heading text-2xl text-charcoal font-bold mb-3">Paiement en cours de traitement</h1>
          <p class="text-gray-500 mb-8">
            Votre paiement est en cours de validation. Vous recevrez un email de confirmation dès que votre commande sera confirmée.
          </p>
          <a routerLink="/">
            <button pButton label="Retour à l'accueil" icon="pi pi-home"
              style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.85rem 2rem;">
            </button>
          </a>
        </ng-container>

        <!-- État : erreur -->
        <ng-container *ngIf="etat === 'erreur'">
          <div class="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
            <i class="pi pi-times-circle text-5xl text-red-400"></i>
          </div>
          <h1 class="font-heading text-2xl text-charcoal font-bold mb-3">Impossible de confirmer le paiement</h1>
          <p class="text-gray-500 mb-8">
            Une erreur est survenue lors de la vérification de votre paiement.
            Si vous avez été débité, contactez-nous par email.
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <a routerLink="/">
              <button pButton label="Retour à l'accueil" icon="pi pi-home"
                style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.85rem 2rem;">
              </button>
            </a>
            <a routerLink="/contact">
              <button pButton label="Nous contacter" icon="pi pi-envelope"
                class="p-button-outlined"
                style="border-color: #5a8a4a; color: #5a8a4a; border-radius: 2rem; padding: 0.85rem 2rem;">
              </button>
            </a>
          </div>
        </ng-container>

      </div>
    </div>
  `
})
export class PaymentSuccessComponent implements OnInit, OnDestroy {
  /** État courant de la page */
  etat: EtatPaiement = 'chargement';
  /** Numéro de commande retourné par l'API */
  numeroCommande: string | null = null;
  /** Compteur de tentatives de vérification */
  tentative = 0;
  /** Nombre maximum de tentatives avant d'afficher l'état "attente" */
  readonly maxTentatives = 10;

  isGuest = false;
  customerEmail: string | null = null;
  password = '';
  confirmPassword = '';
  converting = false;
  accountCreated = false;

  private abonnements = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cartService: CartService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupération du session_id depuis les query params
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (!sessionId) {
      // Pas de session_id : on affiche un succès générique (retour direct sur la page)
      this.etat = 'succes';
      this.cartService.clearCart();
      this.customerEmail = null;
      this.isGuest = !this.authService.isLoggedIn();
      return;
    }

    // Démarrage du polling toutes les 2 secondes, 10 tentatives maximum
    const polling$ = interval(2000).pipe(
      take(this.maxTentatives),
      switchMap(() => {
        this.tentative++;
        return this.http.get<SessionStatus>(
          `${environment.apiUrl}/payments/session/${sessionId}`
        );
      }),
      // On arrête dès que le statut est final (paid ou complete)
      takeWhile(
        (session) => !this.estStatutFinal(session.status),
        true // inclusive : on traite également l'émission qui satisfait la condition
      )
    );

    this.abonnements.add(
      polling$.subscribe({
        next: (session) => this.traiterReponseSession(session),
        error: () => {
          // En cas d'erreur réseau après épuisement des tentatives
          if (this.etat === 'chargement') {
            this.etat = 'erreur';
          }
        },
        complete: () => {
          // Si on a épuisé toutes les tentatives sans statut final
          if (this.etat === 'chargement') {
            this.etat = 'attente';
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.abonnements.unsubscribe();
  }

  convertGuestToUser() {
    if (!this.password || !this.confirmPassword) {
      this.messageService.add({ severity: 'warn', summary: 'Champs requis', detail: 'Veuillez remplir les deux champs.' });
      return;
    }
    this.converting = true;
    this.http.post<any>(`${environment.apiUrl}/auth/convert-guest`, {
      email: this.customerEmail,
      password: this.password,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: (res: any) => {
        this.authService.saveToken(res.accessToken);
        this.accountCreated = true;
        this.converting = false;
        this.messageService.add({ severity: 'success', summary: 'Compte créé !', detail: 'Vous êtes maintenant connecté.' });
      },
      error: (err: any) => {
        const msg = err?.error?.message || 'Une erreur est survenue.';
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: msg });
        this.converting = false;
      }
    });
  }

  /** Vérifie si le statut est considéré comme finalisé (paiement confirmé) */
  private estStatutFinal(status: string): boolean {
    return status === 'complete' || status === 'paid' || status === 'PAID';
  }

  /** Traite la réponse de l'API de session Stripe */
  private traiterReponseSession(session: SessionStatus): void {
    if (this.estStatutFinal(session.status)) {
      this.etat = 'succes';
      this.numeroCommande = session.orderNumber ?? null;
      // Vidage du panier après confirmation du paiement
      this.cartService.clearCart();
      this.customerEmail = session.customerEmail ?? null;
      this.isGuest = !this.authService.isLoggedIn();
    }
  }
}
