import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { GoogleMapsLoader } from '../../core/services/google-maps-loader';

@Component({
  selector: 'app-search-box',
  standalone: true,
  templateUrl: './search-box.html',
  styleUrls: ['./search-box.scss'],
})
export class SearchBox implements AfterViewInit {
  isFocused = signal(false);
  query = signal('');
  predictions = signal<google.maps.places.AutocompletePrediction[]>([]);
  searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');
  map = input<google.maps.Map | undefined>();

  placeSelected = output<{
    name?: string;
    formatted_address?: string;
    location: google.maps.LatLngLiteral | null;
  }>();
  cancelled = output<void>();

  private autocompleteService?: google.maps.places.AutocompleteService;
  private geocoder?: google.maps.Geocoder;

  constructor(private loader: GoogleMapsLoader) {}

  async ngAfterViewInit() {
    await this.loader.load();

    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();

    const inputEl = this.searchInput().nativeElement;

    inputEl.addEventListener('focus', () => this.isFocused.set(true));
    inputEl.addEventListener('blur', () => this.isFocused.set(false));

    inputEl.addEventListener('input', (e) => {
      const query = (e.target as HTMLInputElement).value;
      this.query.set(query);

      if (!query || !this.autocompleteService) {
        this.predictions.set([]);
        return;
      }

      this.autocompleteService.getPlacePredictions(
        { input: query, types: ['geocode'] },
        (results) => this.predictions.set(results || [])
      );
    });
  }

  selectPrediction(prediction: google.maps.places.AutocompletePrediction) {
    if (!this.geocoder || !prediction.place_id) return;

    this.geocoder.geocode({ placeId: prediction.place_id }, (results) => {
      if (!results || !results[0]) return;

      const location = results[0].geometry?.location;
      const loc = location ? { lat: location.lat(), lng: location.lng() } : null;

      const map = this.map();
      if (map && loc) {
        map.panTo(loc);
        map.setZoom(15);
      }

      this.placeSelected.emit({
        name: results[0].formatted_address,
        formatted_address: results[0].formatted_address,
        location: loc,
      });

      this.predictions.set([]);
      this.query.set(prediction.description);
      this.searchInput().nativeElement.value = prediction.description;
    });
  }

  onCancelSearch() {
    const inputEl = this.searchInput().nativeElement;
    inputEl.value = '';
    this.query.set('');
    this.predictions.set([]);
    this.cancelled.emit();
  }
}
