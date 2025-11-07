import { Injectable } from '@angular/core';
import { SpotVideoOverlay } from '../../components/spot-video-overlay/spot-video-overlay';

@Injectable({
  providedIn: 'root',
})
export class OverlayManager {
  private activeOverlay?: SpotVideoOverlay;

  closeActiveOverlay() {
    if (this.activeOverlay) {
      this.activeOverlay.destroy();
      this.activeOverlay = undefined;
    }
  }

  setActiveOverlay(overlay: SpotVideoOverlay) {
    this.closeActiveOverlay();
    this.activeOverlay = overlay;
  }
}
