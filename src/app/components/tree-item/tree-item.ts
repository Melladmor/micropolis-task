import { Component, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaNode, SpotDto } from '../../core/models/areas';
import { ContextAction } from '../../core/models/contextmenu';
import { ContextMenuService } from '../../core/services/context-menu-service';

@Component({
  selector: 'app-tree-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tree-item.html',
  styleUrl: './tree-item.scss',
})
export class TreeItem {
  private contextMenu = inject<ContextMenuService>(ContextMenuService);
  map = signal<google.maps.Map | undefined>(undefined);
  node = input.required<AreaNode>();
  level = input<number>(0);
  activeSpotId = input<number | null>(null);
  spotSelected = output<SpotDto>();
  expanded = signal(false);
  newSpotRequested = output<number>();
  getSelectedAreaId(): number | null {
    return this.node()?.area?.id ?? null;
  }

  openContextMenu(event: MouseEvent, target: 'node' | SpotDto) {
    event.preventDefault();
    const actions = [
      { icon: '/icons/open.svg', label: 'Open', action: () => console.log('Open', target) },
      {
        icon: '/icons/open.svg',
        label: 'Open in new tap',
        action: () => console.log('Open in new tap', target),
      },
      {
        divider: true,
      },
      { icon: '/icons/open.svg', label: 'Cut', action: () => console.log('Cut', target) },
      {
        icon: '/icons/open.svg',
        label: 'Rename',
        action: () => console.log('Rename', target),
      },
      {
        icon: '/icons/open.svg',
        label: 'Delete',
        action: () => console.log('Rename', target),
      },
      {
        divider: true,
      },
      {
        icon: '/icons/camera.svg',
        label: 'New Spot',
        action: () => {
          const areaId = this.node()?.area?.id ?? null;
          this.newSpotRequested.emit(areaId);
        },
      },
      {
        icon: '/icons/firstlevel.svg',
        label: 'New Area',
        action: () => console.log('New Spot', target),
      },
    ];

    if (target !== 'node') {
      actions.unshift({
        icon: '/icons/camera.svg',
        label: 'View Spot',
        action: () => this.onSpotClick(target),
      });
    }
    this.contextMenu.open(event.pageX, event.pageY, actions);
  }

  toggleExpand() {
    this.expanded.update((prev) => !prev);
  }

  onSpotClick(spot: SpotDto) {
    this.spotSelected.emit(spot);
  }
  isActive(spotId: number): boolean {
    return this.activeSpotId() === spotId;
  }
}
