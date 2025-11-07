import { Injectable, signal } from '@angular/core';
import { SpotDto } from '../models/areas';

@Injectable({
  providedIn: 'root',
})
export class PinnedSpots {
  pinnedSpots = signal<SpotDto[]>([]);

  addSpot(spot: SpotDto) {
    const current = this.pinnedSpots();
    if (!current.find((s) => s.id === spot.id)) {
      this.pinnedSpots.set([...current, spot]);
    }
  }

  removeSpot(id: number) {
    this.pinnedSpots.set(this.pinnedSpots().filter((s) => s.id !== id));
  }

  clear() {
    this.pinnedSpots.set([]);
  }

  /** ✅ Check if a spot is already pinned */
  isPinned(id: number): boolean {
    return this.pinnedSpots().some((s) => s.id === id);
  }
}
