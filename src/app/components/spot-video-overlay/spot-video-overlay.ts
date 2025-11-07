import {
  Component,
  ComponentRef,
  createComponent,
  ElementRef,
  EnvironmentInjector,
  inject,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinnedSpots } from '../../core/services/pinned-spots';
import { SpotDto } from '../../core/models/areas';

@Component({
  selector: 'app-spot-video-overlay',
  imports: [CommonModule],
  templateUrl: './spot-video-overlay.html',
  styleUrl: './spot-video-overlay.scss',
})
export class SpotVideoOverlay {
  private overlay?: google.maps.OverlayView;
  private mapInstance?: google.maps.Map;
  spotData?: SpotDto;
  private componentRef?: ComponentRef<SpotVideoOverlay>;
  pinnedSpotsService?: PinnedSpots;

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  onClosed?: () => void;

  initialize(map: google.maps.Map, spot: SpotDto, injector: EnvironmentInjector) {
    this.mapInstance = map;
    this.spotData = spot;
    this.createOverlay(injector);
  }

  ngAfterViewInit() {
    this.videoPlayer?.nativeElement?.play().catch((error) => {});
  }

  private createOverlay(injector: EnvironmentInjector) {
    if (!this.mapInstance || !this.spotData) return;

    const self = this;
    const spotData = this.spotData;
    let containerReady = false;

    this.componentRef = createComponent(SpotVideoOverlay, {
      environmentInjector: injector,
    });

    this.componentRef.instance.spotData = spotData;
    this.componentRef.changeDetectorRef.detectChanges();

    const container = this.componentRef.location.nativeElement as HTMLElement;
    container.className = 'video-overlay';

    setTimeout(() => {
      const closeBtn = container.querySelector('.close-btn');
      closeBtn?.addEventListener('click', () => self.destroy());

      const pinBtn = container.querySelector('.pin-btn');
      pinBtn?.addEventListener('click', () => {
        if (spotData && this.pinnedSpotsService) {
          this.pinnedSpotsService.addSpot(spotData);
        }
      });
    });

    class CustomOverlay extends google.maps.OverlayView {
      private measured = false;

      override onAdd() {
        const panes = this.getPanes();
        if (!panes) return;

        panes.overlayMouseTarget.appendChild(container);
        container.style.pointerEvents = 'auto';
        container.style.position = 'absolute';
        container.style.zIndex = '9999';
        container.style.visibility = 'hidden';
      }

      override draw() {
        const projection = this.getProjection();
        if (!projection) return;

        const pos = projection.fromLatLngToDivPixel(
          new google.maps.LatLng(spotData.latitude, spotData.longitude)
        );
        if (!pos) return;

        container.style.display = 'block';
        container.style.position = 'absolute';
        container.style.pointerEvents = 'auto';
        container.style.zIndex = '9999';

        const width = container.offsetWidth || 350;
        const height = container.offsetHeight || 238;

        container.style.left = `${pos.x - width / 2 + 2}px`;
        container.style.top = `${pos.y - height - 45}px`;
        container.style.visibility = 'visible';
      }

      override onRemove() {
        container.remove();
      }
    }

    this.overlay = new CustomOverlay();
    this.overlay.setMap(this.mapInstance);
  }

  onClose() {
    this.destroy();
  }

  destroy() {
    if (this.onClosed) {
      this.onClosed();
    }

    if (this.overlay) {
      this.overlay.setMap(null);
      this.overlay = undefined;
    }
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
  }
}
