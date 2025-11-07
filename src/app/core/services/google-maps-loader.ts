import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoader {
  private loading?: Promise<void>;

  load(): Promise<void> {
    if ((window as any).google?.maps) return Promise.resolve();
    if (this.loading) return this.loading;

    this.loading = new Promise<void>((resolve, reject) => {
      const id = 'google-maps-sdk';
      if (document.getElementById(id)) return resolve();

      const script = document.createElement('script');
      script.id = id;
      script.async = true;
      script.defer = true;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&v=beta&libraries=places`;
      script.onload = () => resolve();
      script.onerror = () => reject('Failed to load Google Maps SDK');
      document.body.appendChild(script);
    });

    return this.loading;
  }
}
