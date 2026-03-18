import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule, InputTextModule, ToastModule, TranslateModule],
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
          <h1 class="font-heading text-3xl text-charcoal font-bold">{{ 'auth.login_title' | translate }}</h1>
          <p class="text-gray-500 mt-2">{{ 'auth.login_subtitle' | translate }}</p>
        </div>

        <!-- Form -->
        <div class="bg-white rounded-2xl shadow-sm p-8">
          <div class="space-y-5">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-charcoal">{{ 'auth.email' | translate }}</label>
              <input pInputText type="email" [(ngModel)]="email" placeholder="marie@exemple.fr"
                class="rounded-xl w-full" (keyup.enter)="submit()" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-charcoal">{{ 'auth.password' | translate }}</label>
              <input pInputText type="password" [(ngModel)]="password" placeholder="••••••••"
                class="rounded-xl w-full" (keyup.enter)="submit()" />
            </div>
          </div>

          <button pButton
            [label]="'auth.login_btn' | translate"
            icon="pi pi-sign-in"
            [loading]="loading"
            (click)="submit()"
            class="w-full mt-6"
            style="background: #5a8a4a; border: none; border-radius: 2rem; padding: 0.85rem;">
          </button>

          <p class="text-center text-sm text-gray-500 mt-5">
            {{ 'auth.no_account' | translate }}
            <a routerLink="/inscription" class="text-primary-green font-medium hover:underline ml-1">{{ 'auth.create_account' | translate }}</a>
          </p>
        </div>

      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  submit() {
    if (!this.email || !this.password) {
      this.messageService.add({
        severity: 'warn',
        summary: this.translate.instant('auth.toast_required'),
        detail: this.translate.instant('auth.toast_fill_all')
      });
      return;
    }
    this.loading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/compte';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('auth.toast_error'),
          detail: this.translate.instant('auth.toast_login_error')
        });
      }
    });
  }
}
