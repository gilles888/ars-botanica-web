import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  createdAt: string;
}

@Component({
  selector: 'app-mon-compte',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    ButtonModule, InputTextModule, PasswordModule, DividerModule, ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast position="bottom-right"></p-toast>
    <div class="pt-20 min-h-screen bg-cream page-enter">

      <!-- Header -->
      <div class="bg-white border-b border-gray-100">
        <div class="container-custom py-10">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-full bg-primary-green flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {{ initials }}
            </div>
            <div>
              <h1 class="font-heading text-3xl text-charcoal font-bold">{{ profil.firstName }} {{ profil.lastName }}</h1>
              <p class="text-gray-400 text-sm mt-0.5">{{ profil.email }}</p>
            </div>
          </div>
          <!-- Liens rapides -->
          <div class="flex gap-4 mt-6">
            <a routerLink="/mes-commandes"
              class="flex items-center gap-2 text-sm text-primary-green hover:underline font-medium">
              <i class="pi pi-list text-xs"></i>
              Mes commandes
            </a>
            <a routerLink="/boutique"
              class="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-green font-medium">
              <i class="pi pi-shopping-bag text-xs"></i>
              Boutique
            </a>
          </div>
        </div>
      </div>

      <div class="container-custom py-12">
        <div class="max-w-2xl mx-auto space-y-6">

          <!-- Informations personnelles -->
          <div class="bg-white rounded-2xl shadow-sm p-8">
            <h2 class="font-heading text-xl text-charcoal font-semibold mb-6 flex items-center gap-3">
              <i class="pi pi-user text-primary-green"></i>
              Informations personnelles
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-charcoal">Prénom</label>
                <input pInputText [(ngModel)]="profil.firstName" class="rounded-xl" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-charcoal">Nom</label>
                <input pInputText [(ngModel)]="profil.lastName" class="rounded-xl" />
              </div>
              <div class="flex flex-col gap-2 sm:col-span-2">
                <label class="text-sm font-medium text-charcoal">Email</label>
                <input pInputText [value]="profil.email" disabled
                  class="rounded-xl opacity-60 cursor-not-allowed" />
                <p class="text-xs text-gray-400">L'adresse email ne peut pas être modifiée.</p>
              </div>
              <div class="flex flex-col gap-2 sm:col-span-2">
                <label class="text-sm font-medium text-charcoal">Téléphone</label>
                <input pInputText type="tel" [(ngModel)]="profil.phone"
                  placeholder="+32 4 00 00 00 00" class="rounded-xl" />
              </div>
            </div>
            <div class="flex justify-end mt-6">
              <button pButton label="Enregistrer" icon="pi pi-check"
                [loading]="savingInfo"
                (click)="saveInfo()"
                style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.75rem 2rem;">
              </button>
            </div>
          </div>

          <!-- Adresse de livraison par défaut -->
          <div class="bg-white rounded-2xl shadow-sm p-8">
            <h2 class="font-heading text-xl text-charcoal font-semibold mb-2 flex items-center gap-3">
              <i class="pi pi-map-marker text-primary-green"></i>
              Adresse de livraison par défaut
            </h2>
            <p class="text-sm text-gray-400 mb-6">
              Cette adresse sera pré-remplie automatiquement lors de vos commandes.
            </p>
            <div class="space-y-5">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-charcoal">Adresse</label>
                <input pInputText [(ngModel)]="profil.address"
                  placeholder="Rue des Fleurs, 12" class="rounded-xl" />
              </div>
              <div class="grid grid-cols-2 gap-5">
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-charcoal">Code postal</label>
                  <input pInputText [(ngModel)]="profil.zip"
                    placeholder="1000" class="rounded-xl" />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-charcoal">Ville</label>
                  <input pInputText [(ngModel)]="profil.city"
                    placeholder="Bruxelles" class="rounded-xl" />
                </div>
              </div>
            </div>
            <div class="flex justify-end mt-6">
              <button pButton label="Enregistrer l'adresse" icon="pi pi-check"
                [loading]="savingAddress"
                (click)="saveAddress()"
                style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.75rem 2rem;">
              </button>
            </div>
          </div>

          <!-- Mot de passe -->
          <div class="bg-white rounded-2xl shadow-sm p-8">
            <h2 class="font-heading text-xl text-charcoal font-semibold mb-6 flex items-center gap-3">
              <i class="pi pi-lock text-primary-green"></i>
              Changer le mot de passe
            </h2>
            <div class="space-y-5">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-charcoal">Nouveau mot de passe</label>
                <p-password [(ngModel)]="newPassword" [toggleMask]="true" [feedback]="true"
                  promptLabel="Entrez un mot de passe"
                  weakLabel="Faible" mediumLabel="Moyen" strongLabel="Fort"
                  styleClass="w-full" inputStyleClass="w-full rounded-xl">
                </p-password>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-charcoal">Confirmer le mot de passe</label>
                <p-password [(ngModel)]="confirmPassword" [toggleMask]="true" [feedback]="false"
                  styleClass="w-full" inputStyleClass="w-full rounded-xl">
                </p-password>
                <p *ngIf="confirmPassword && newPassword !== confirmPassword"
                  class="text-xs text-red-400">Les mots de passe ne correspondent pas.</p>
              </div>
            </div>
            <div class="flex justify-end mt-6">
              <button pButton label="Changer le mot de passe" icon="pi pi-lock"
                [loading]="savingPassword"
                [disabled]="!newPassword || newPassword !== confirmPassword"
                (click)="savePassword()"
                style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.75rem 2rem;">
              </button>
            </div>
          </div>

          <!-- Déconnexion -->
          <div class="flex justify-center pt-2 pb-8">
            <button pButton label="Se déconnecter" icon="pi pi-sign-out"
              class="p-button-text p-button-sm"
              style="color: #9ca3af; font-size: 0.875rem;"
              (click)="logout()">
            </button>
          </div>

        </div>
      </div>
    </div>
  `
})
export class MonCompteComponent implements OnInit {
  profil: UserProfile = { id: 0, firstName: '', lastName: '', email: '', phone: '', address: '', city: '', zip: '', createdAt: '' };
  newPassword = '';
  confirmPassword = '';
  savingInfo = false;
  savingAddress = false;
  savingPassword = false;

  get initials(): string {
    return ((this.profil.firstName?.[0] ?? '') + (this.profil.lastName?.[0] ?? '')).toUpperCase() || '?';
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/connexion'], { queryParams: { returnUrl: '/compte' } });
      return;
    }
    this.http.get<UserProfile>(`${environment.apiUrl}/users/me`).subscribe({
      next: (u) => this.profil = u,
      error: () => this.showError('Impossible de charger votre profil.')
    });
  }

  saveInfo() {
    this.savingInfo = true;
    this.http.put<UserProfile>(`${environment.apiUrl}/users/me`, {
      firstName: this.profil.firstName,
      lastName: this.profil.lastName,
      phone: this.profil.phone
    }).subscribe({
      next: (u) => { this.profil = u; this.savingInfo = false; this.showSuccess('Informations mises à jour.'); },
      error: () => { this.savingInfo = false; this.showError('Erreur lors de la sauvegarde.'); }
    });
  }

  saveAddress() {
    this.savingAddress = true;
    this.http.put<UserProfile>(`${environment.apiUrl}/users/me`, {
      firstName: this.profil.firstName,
      lastName: this.profil.lastName,
      phone: this.profil.phone,
      address: this.profil.address,
      city: this.profil.city,
      zip: this.profil.zip
    }).subscribe({
      next: (u) => { this.profil = u; this.savingAddress = false; this.showSuccess('Adresse enregistrée.'); },
      error: () => { this.savingAddress = false; this.showError('Erreur lors de la sauvegarde.'); }
    });
  }

  savePassword() {
    if (this.newPassword !== this.confirmPassword) return;
    this.savingPassword = true;
    this.http.put<UserProfile>(`${environment.apiUrl}/users/me`, {
      firstName: this.profil.firstName,
      lastName: this.profil.lastName,
      phone: this.profil.phone,
      password: this.newPassword
    }).subscribe({
      next: () => {
        this.savingPassword = false;
        this.newPassword = '';
        this.confirmPassword = '';
        this.showSuccess('Mot de passe mis à jour.');
      },
      error: () => { this.savingPassword = false; this.showError('Erreur lors du changement de mot de passe.'); }
    });
  }

  logout() {
    this.authService.logout();
  }

  private showSuccess(msg: string) {
    this.messageService.add({ severity: 'success', summary: 'Enregistré', detail: msg, life: 3000 });
  }

  private showError(msg: string) {
    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: msg, life: 4000 });
  }
}
