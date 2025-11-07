import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenStore {
  accessToken = signal<string | null>(localStorage.getItem('token'));
  refreshToken = signal<string | null>(localStorage.getItem('refreshToken'));

  setTokens(access: string, refresh?: string) {
    localStorage.setItem('token', access);
    this.accessToken.set(access);

    if (refresh !== undefined) {
      localStorage.setItem('refreshToken', refresh);
      this.refreshToken.set(refresh);
    }
  }

  clear() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.accessToken.set(null);
    this.refreshToken.set(null);
  }

  get token() {
    return this.accessToken();
  }
}
