import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { TokenStore } from './token-store';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokens = inject(TokenStore);

  private baseUrl = environment.apiUrl;

  loading = signal(false);
  error = signal<string | null>(null);

  get<T>(endpoint: string, options?: { headers?: HttpHeaders; params?: any }): Observable<T> {
    this.startLoading();
    const url = this.buildUrl(endpoint);
    const headers = this.getAuthHeaders(options?.headers);

    return this.http.get<T>(url, { ...options, headers }).pipe(
      tap({
        next: () => this.clearError(),
        error: () => this.stopLoading(),
      }),
      catchError((err) => this.handleError(err)),
      finalize(() => this.stopLoading())
    );
  }

  refetch<T>(endpoint: string, options?: { headers?: HttpHeaders; params?: any }): Observable<T> {
    this.startLoading();
    const url = this.buildUrl(endpoint);
    const headers = this.getAuthHeaders(options?.headers);

    return this.http.get<T>(url, { ...options, headers }).pipe(
      tap({
        next: () => this.clearError(),
        error: () => this.stopLoading(),
      }),
      catchError((err) => this.handleError(err)),
      finalize(() => this.stopLoading())
    );
  }

  post<T>(
    endpoint: string,
    body: any,
    options?: { headers?: HttpHeaders; params?: any }
  ): Observable<T> {
    this.startLoading();
    const url = this.buildUrl(endpoint);
    const headers = this.getAuthHeaders(options?.headers);

    return this.http.post<T>(url, body, { ...options, headers }).pipe(
      tap({
        next: () => this.clearError(),
        error: () => this.stopLoading(),
      }),
      catchError((err) => this.handleError(err)),
      finalize(() => this.stopLoading())
    );
  }

  put<T>(
    endpoint: string,
    body: any,
    options?: { headers?: HttpHeaders; params?: any }
  ): Observable<T> {
    this.startLoading();
    const url = this.buildUrl(endpoint);
    const headers = this.getAuthHeaders(options?.headers);

    return this.http.put<T>(url, body, { ...options, headers }).pipe(
      tap({
        next: () => this.clearError(),
        error: () => this.stopLoading(),
      }),
      catchError((err) => this.handleError(err)),
      finalize(() => this.stopLoading())
    );
  }

  delete<T>(endpoint: string, options?: { headers?: HttpHeaders; params?: any }): Observable<T> {
    this.startLoading();
    const url = this.buildUrl(endpoint);
    const headers = this.getAuthHeaders(options?.headers);

    return this.http.delete<T>(url, { ...options, headers }).pipe(
      tap({
        next: () => this.clearError(),
        error: () => this.stopLoading(),
      }),
      catchError((err) => this.handleError(err)),
      finalize(() => this.stopLoading())
    );
  }

  private getAuthHeaders(customHeaders?: HttpHeaders): HttpHeaders {
    const token = this.tokens.token;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    if (customHeaders) {
      customHeaders.keys().forEach((key) => {
        const value = customHeaders.get(key);
        if (value) headers = headers.set(key, value);
      });
    }

    return headers;
  }

  private buildUrl(endpoint: string): string {
    if (!endpoint.startsWith('/')) endpoint = '/' + endpoint;
    return `${this.baseUrl}${endpoint}`;
  }

  private startLoading() {
    if (!this.loading()) this.loading.set(true);
  }

  private stopLoading() {
    if (this.loading()) this.loading.set(false);
  }

  private clearError() {
    if (this.error()) this.error.set(null);
  }

  private handleError(err: HttpErrorResponse) {
    console.error('API Error:', err);

    if (err.status === 401) {
      console.warn('🚫 Unauthorized — redirecting to login');
      this.tokens.clear();
      this.router.navigate(['/login']);
    }

    this.error.set(err.message || 'An error occurred');

    this.stopLoading();
    return throwError(() => err);
  }
}
