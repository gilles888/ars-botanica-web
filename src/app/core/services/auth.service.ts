import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthUser } from '../models/auth-user.model';
import { AuthentificationService, AuthResponse } from '@core/api/generated';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'bloom_token';
  private readonly USER_KEY = 'bloom_user';

  currentUser$ = new BehaviorSubject<AuthUser | null>(this.loadUser());

  constructor(private authApiService: AuthentificationService, private router: Router) {}

  login(email: string, password: string): Observable<AuthUser> {
    return this.authApiService.login({ email, password }).pipe(
      map(response => this.mapToAuthUser(response)),
      tap(user => this.storeUser(user))
    );
  }

  register(firstName: string, lastName: string, email: string, password: string): Observable<AuthUser> {
    return this.authApiService.register({ firstName, lastName, email, password }).pipe(
      map(response => this.mapToAuthUser(response)),
      tap(user => this.storeUser(user))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser$.next(null);
    this.router.navigate(['/connexion']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.currentUser$.value?.role === 'ADMIN';
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private mapToAuthUser(response: AuthResponse): AuthUser {
    return {
      userId: response.userId ?? 0,
      email: response.email ?? '',
      firstName: response.firstName ?? '',
      lastName: response.lastName ?? '',
      role: response.role ?? '',
      accessToken: response.accessToken ?? '',
    };
  }

  private storeUser(user: AuthUser): void {
    localStorage.setItem(this.TOKEN_KEY, user.accessToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser$.next(user);
  }

  private loadUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(this.USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}
