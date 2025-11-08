import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { ApiService } from './api.service';
import { TokenStore } from './token-store';



@Injectable({ providedIn: 'root' })
export class Auth {
  private api = inject(ApiService);
  private tokens = inject(TokenStore);

  error = signal<Error | null>(null);
  user = signal<any>(null);

  get loading() {
    return this.api.loading();
  }
  login(email: string, password: string) {
    return this.api.post<LoginResponse>('/auth/signin', { email, password }).pipe(
      tap({
        next: (res) => {
          this.tokens.setTokens(res.data.token, res.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(res.data));
          this.user.set(res.data);
        },
        error: (err: Error) => {
          this.error.set(err);
        },
      })
    );
  }

  logout() {
    this.tokens.clear();
    this.user.set(null);
  }

  getToken() {
    return this.tokens.token;
  }
}
