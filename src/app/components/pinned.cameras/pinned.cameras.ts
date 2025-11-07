import { Component, inject, input, signal } from '@angular/core';
import { PinnedSpots } from '../../core/services/pinned-spots';
import { SpotDto } from '../../core/models/areas';

@Component({
  selector: 'app-pinned-cameras',
  imports: [],
  templateUrl: './pinned.cameras.html',
  styleUrl: './pinned.cameras.scss',
})
export class PinnedCameras {
  pinnedCameras = input<SpotDto | null>(null);

  private pinnedSpotsService = inject(PinnedSpots);

  unpinCamera() {
    const camera = this.pinnedCameras();
    if (!camera) return;

    this.pinnedSpotsService.removeSpot(camera.id);
  }
}
