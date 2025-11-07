import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-add-spot-pin',
  standalone: true,
  imports: [],
  templateUrl: './add-spot-pin.html',
  styleUrl: './add-spot-pin.scss',
})
export class AddSpotPin {
  map = input<google.maps.Map>();
  editingStarted = output<void>();
  locationConfirmed = output<{
    lat: number;
    lng: number;
    formatted_address?: string;
    place_id?: string;
    country?: string;
    city?: string;
    area?: string;
  }>();
  private geocoder = new google.maps.Geocoder();
  private centerListener?: google.maps.MapsEventListener;
  active = signal(false);
  center = signal<google.maps.LatLngLiteral | null>(null);
  frozen = signal(false);
  cancelled = output<void>();

  start() {
    const map = this.map();
    if (!map) return;
    this.active.set(true);
    this.frozen.set(false);
    map.setOptions({ draggableCursor: 'grabbing' });

    this.attachCenterTracking(map);
  }

  private attachCenterTracking(map: google.maps.Map) {
    const updateCenter = () => {
      if (this.frozen()) return;
      const c = map.getCenter();
      if (c) this.center.set({ lat: c.lat(), lng: c.lng() });
    };

    if (this.centerListener) google.maps.event.removeListener(this.centerListener);
    this.centerListener = map.addListener('center_changed', updateCenter);
    updateCenter();
  }

  async confirm() {
    const map = this.map();
    if (!map) return;

    let coords = this.center();
    const c = map.getCenter();
    if (c) coords = { lat: c.lat(), lng: c.lng() };
    if (!coords) return;

    try {
      const result = await this.reverseGeocode(coords);

      this.locationConfirmed.emit(result);
    } catch (err) {
      console.warn('Reverse geocoding failed:', err);
      this.locationConfirmed.emit(coords);
    }

    this.freezeMap(map);
  }

  private reverseGeocode(coords: google.maps.LatLngLiteral): Promise<{
    lat: number;
    lng: number;
    formatted_address?: string;
    place_id?: string;
    country?: string;
    city?: string;
    area?: string;
  }> {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ location: coords }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const r = results[0];
          const components = r.address_components || [];
          const get = (type: string) => components.find((c) => c.types.includes(type))?.long_name;

          resolve({
            lat: coords.lat,
            lng: coords.lng,
            formatted_address: r.formatted_address,
            place_id: r.place_id,
            country: get('country'),
            city: get('locality') || get('administrative_area_level_1'),
            area: get('sublocality') || get('neighborhood'),
          });
        } else reject(status);
      });
    });
  }

  edit() {
    const map = this.map();
    if (!map) return;
    this.unfreezeMap(map);
    this.editingStarted.emit();
  }

  private freezeMap(map: google.maps.Map) {
    this.frozen.set(true);
    if (this.centerListener) {
      google.maps.event.removeListener(this.centerListener);
      this.centerListener = undefined;
    }

    map.setOptions({
      draggable: false,
      scrollwheel: false,
      disableDoubleClickZoom: true,
      gestureHandling: 'none',
      keyboardShortcuts: false,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      draggableCursor: 'default',
    });
  }

  private unfreezeMap(map: google.maps.Map) {
    this.frozen.set(false);
    this.attachCenterTracking(map);
    map.setOptions({
      draggable: true,
      scrollwheel: true,
      disableDoubleClickZoom: false,
      gestureHandling: 'auto',
      keyboardShortcuts: true,
      zoomControl: true,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      draggableCursor: 'grabbing',
    });
  }

  cancel() {
    this.cancelled.emit();
    this.deactivate();
  }

  private deactivate() {
    const map = this.map();
    this.active.set(false);
    this.frozen.set(false);

    if (this.centerListener) {
      google.maps.event.removeListener(this.centerListener);
      this.centerListener = undefined;
    }

    if (map) {
      map.setOptions({
        draggable: true,
        scrollwheel: true,
        disableDoubleClickZoom: false,
        gestureHandling: 'auto',
        draggableCursor: '',
      });
    }
  }
  unfreeze() {
    const map = this.map();
    if (!map) return;
    this.unfreezeMap(map);
  }
}
