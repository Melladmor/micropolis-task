import {
  Component,
  input,
  OnDestroy,
  OnInit,
  inject,
  EnvironmentInjector,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotVideoOverlay } from '../spot-video-overlay/spot-video-overlay';
import { OverlayManager } from '../../core/services/overlay-manager';
import { PinnedSpots } from '../../core/services/pinned-spots';
import { SpotDto } from '../../core/models/areas';

@Component({
  selector: 'app-spot-marker',
  imports: [CommonModule],
  templateUrl: './spot-marker.html',
  styleUrl: './spot-marker.scss',
})
export class SpotMarker implements OnInit, OnDestroy {
  map = input.required<google.maps.Map>();
  spot = input.required<SpotDto>();
  iconUrl = input<string>('/icons/camera.svg');
  private overlayManager = inject(OverlayManager);

  private marker?: google.maps.marker.AdvancedMarkerElement;
  private clickListener?: google.maps.MapsEventListener;
  private overlay?: SpotVideoOverlay;
  private markerDiv?: HTMLDivElement;
  private environmentInjector = inject(EnvironmentInjector);
  private pinnedSpots = inject(PinnedSpots);

  private readonly DEFAULT_COLOR = '#014eff';
  private readonly ACTIVE_COLOR = '#ffcc00';

  async ngOnInit() {
    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      'marker'
    )) as google.maps.MarkerLibrary;

    const div = document.createElement('div');
    div.classList.add('custom-marker');
    div.style.backgroundColor = this.DEFAULT_COLOR;
    div.style.width = '30px';
    div.style.height = '30px';
    div.style.borderRadius = '10px';
    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';
    div.style.boxShadow = '0px 3px 6px #00000080';
    div.style.cursor = 'pointer';
    div.style.position = 'relative';
    div.style.transition = 'background-color 0.3s ease';

    const img = document.createElement('img');
    img.src = this.iconUrl();
    img.alt = this.spot().name;
    img.style.width = '16px';
    img.style.height = '16px';
    div.appendChild(img);

    this.markerDiv = div;

    this.marker = new AdvancedMarkerElement({
      map: this.map(),
      position: { lat: this.spot().latitude, lng: this.spot().longitude },
      content: div,
      title: this.spot().name,
      gmpClickable: true,
    });

    this.clickListener = this.marker.addListener('click', () => {
      this.overlayManager.closeActiveOverlay();
      this.setMarkerActive(true);
      this.overlay = new SpotVideoOverlay();
      this.overlay.pinnedSpotsService = this.pinnedSpots;
      this.overlay.onClosed = () => {
        this.setMarkerActive(false);
      };

      this.overlayManager.setActiveOverlay(this.overlay);

      this.overlay.initialize(this.map(), this.spot(), this.environmentInjector);
    });
  }

  private setMarkerActive(active: boolean) {
    if (this.markerDiv) {
      this.markerDiv.style.backgroundColor = active ? this.ACTIVE_COLOR : this.DEFAULT_COLOR;
    }
  }

  ngOnDestroy() {
    if (this.clickListener) {
      google.maps.event.removeListener(this.clickListener);
    }
    if (this.marker) {
      this.marker.map = null;
    }
    if (this.overlay) {
      this.overlay.destroy();
    }
  }
}
