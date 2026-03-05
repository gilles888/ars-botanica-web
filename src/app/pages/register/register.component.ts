import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule, InputTextModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast position="bottom-right"></p-toast>
    <div class="min-h-screen bg-cream flex items-center justify-center px-4 pt-20">
      <div class="w-full max-w-md">

        <!-- Logo -->
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex items-center gap-2 mb-6">
            <div class="w-10 h-10 rounded-full bg-primary-green flex items-center justify-center">
              <i class="pi pi-heart text-white"></i>
            </div>
            <span class="font-heading text-2xl font-semibold text-charcoal">Ars <span class="text-primary-green">Botanica</span></span>
          </a>
          <h1 class="font-heading text-3xl text-charcoal font-bold">Créer un compte</h1>
          <p class="text-gray-500 mt-2">Rejoignez la communauté Ars Botanica</p>
        </div>

        <!-- Form -->
        <div class="bg-white rounded-2xl shadow-sm p-8">
          <div class="space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-charcoal">Prénom</label>
                <input pInputText [(ngModel)]="firstName" placeholder="Marie" class="rounded-xl w-full" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-charcoal">Nom</label>
                <input pInputText [(ngModel)]="lastName" placeholder="Dupont" class="rounded-xl w-full" />
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-charcoal">Email</label>
              <input pInputText type="email" [(ngModel)]="email" placeholder="marie@exemple.fr" class="rounded-xl w-full" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-charcoal">Mot de passe</label>
              <input pInputText type="password" [(ngModel)]="password" placeholder="••••••••" class="rounded-xl w-full" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-charcoal">Confirmer le mot de passe</label>
              <input pInputText type="password" [(ngModel)]="confirm" placeholder="••••••••" class="rounded-xl w-full" />
            </div>
          </div>

          <button pButton
            label="Créer mon compte"
            icon="pi pi-user-plus"
            [loading]="loading"
            (click)="submit()"
            class="w-full mt-6"
            style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.85rem;">
          </button>

          <p class="text-center text-sm text-gray-500 mt-5">
            Déjà un compte ?
            <a routerLink="/connexion" class="text-primary-green font-medium hover:underline ml-1">Se connecter</a>
          </p>
        </div>

      </div>
    </div>
  `
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirm = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  submit() {
    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      this.messageService.add({ severity: 'warn', summary: 'Champs requis', detail: 'Veuillez remplir tous les champs.' });
      return;
    }
    if (this.password !== this.confirm) {
      this.messageService.add({ severity: 'warn', summary: 'Erreur', detail: 'Les mots de passe ne correspondent pas.' });
      return;
    }
    this.loading = true;
    this.authService.register(this.firstName, this.lastName, this.email, this.password).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Compte créé', detail: 'Bienvenue chez Ars Botanica !' });
        setTimeout(() => this.router.navigate(['/connexion']), 1500);
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de créer le compte. Cet email est peut-être déjà utilisé.' });
      }
    });
  }
}
