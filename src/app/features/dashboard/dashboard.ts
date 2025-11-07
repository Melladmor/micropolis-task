import { Component, inject, OnInit, output, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapsLoader } from '../../core/services/google-maps-loader';
import { environment } from '../../../environments/environment';
import { SearchBox } from '../../components/search-box/search-box';
import { collectSpots } from '../../core/utils/flatten-spots/flatten-spots';
import { FloatingButton } from '../../components/floating-button/floating-button';
import { FloatingPanel } from '../../components/floating-panel/floating-panel';
import { TreeItem } from '../../components/tree-item/tree-item';
import { SpotMarker } from '../../components/spot-marker/spot-marker';
import { PinnedSpots } from '../../core/services/pinned-spots';
import { PinnedCameras } from '../../components/pinned.cameras/pinned.cameras';
import { AddSpotPin } from '../../components/add-spot-pin/add-spot-pin';
import { ApiService } from '../../core/services/api.service';
import { AreaNode, SpotDto } from '../../core/models/areas';
import { SpotForm } from '../../components/spot-form/spot-form';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    GoogleMapsModule,
    SearchBox,
    FloatingButton,
    FloatingPanel,
    TreeItem,
    SpotMarker,
    PinnedCameras,
    AddSpotPin,
    SpotForm,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  @ViewChild('spotsPanel') spotsPanel!: FloatingPanel;
  @ViewChild('pinnedPanel') pinnedPanel!: FloatingPanel;
  @ViewChild('addSpotPanel') addSpotPanel!: FloatingPanel;
  @ViewChild(AddSpotPin) addSpotPinCmp?: AddSpotPin;
  @ViewChild(TreeItem) treeItemCmp?: TreeItem;
  selectedAreaId = signal<number | null>(null);
  extractedLocationName = signal<{ id: number; name: string }[] | null>(null);
  api = inject(ApiService);
  private loader = inject(GoogleMapsLoader);
  private pinnedService = inject(PinnedSpots);
  map = signal<google.maps.Map | undefined>(undefined);
  ready = signal(false);
  center = signal<google.maps.LatLngLiteral>({ lat: 25.2048, lng: 55.2708 });
  zoom = signal(12);
  areas = signal<AreaNode[]>([]);
  allSpots = signal<SpotDto[]>([]);
  mapRef = signal<google.maps.Map | null>(null);
  activeId = signal<number | null>(null);
  addSpotMode = signal(false);
  pinnedSpots = this.pinnedService.pinnedSpots;
  spotAddLoaction = signal<{
    lat: number;
    lng: number;
    formatted_address?: string;
    place_id?: string;
    country?: string;
    city?: string;
    area?: string;
  } | null>(null);
  clearAllPindSpots = this.pinnedService.clear;

  floatingButtonStyle = signal({
    transform: 'rotate(-90deg)',
    transition: 'right 0.3s ease',
  });
  floatingCameraButtonStyle = signal({
    transform: 'rotate(-90deg)',
    width: '189px',
    transition: 'left 0.3s ease',
  });

  togglePanel() {
    this.spotsPanel.toggle();
    if (this.pinnedPanel.isOpen()) {
      this.pinnedPanel.close();
    }
  }
  togglePinnedPanel() {
    this.pinnedPanel.toggle();
    if (this.spotsPanel.isOpen()) {
      this.spotsPanel.close();
    }
  }

  openAddSpotPanel() {
    this.addSpotPanel.toggle();
    if (this.spotsPanel?.isOpen()) this.spotsPanel.close();
    if (this.pinnedPanel?.isOpen()) this.pinnedPanel.close();
  }
  closeAddSpotPanel() {
    if (this.addSpotPanel?.isOpen()) {
      this.addSpotPanel.close();
      this.closeAddSpotPanel();
      this.addSpotMode.set(false);
      this.addSpotPinCmp?.unfreeze();
    }
  }
  async ngOnInit() {
    await this.loader.load();
    this.ready.set(true);
  }

  onMapReady(map: google.maps.Map) {
    this.map.set(map);
    map.setOptions({
      mapId: environment.mapId,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
    });
    this.api.get<AreaNode>('/surveillance/areas/all').subscribe({
      next: (res: any) => {
        this.areas.set(res.data);
        const spots = collectSpots(res.data);
        this.allSpots.set(spots);
      },
      error: (err) => {
        console.error('API error:', err);
      },
    });
  }

  onPlaceSelected(e: { location: google.maps.LatLngLiteral | null }) {
    if (!e.location || !this.map()) return;
    this.map()!.panTo(e.location);
    this.map()!.setZoom(15);
  }

  onSearchCancelled() {
    const currentMap = this.map();
    if (currentMap) {
      currentMap.panTo(this.center());
      currentMap.setZoom(this.zoom());
    }
  }
  onSpotSelected(spot: SpotDto) {
    if (!this.map() || !spot.latitude || !spot.longitude) return;

    const loc = { lat: spot.latitude, lng: spot.longitude };
    this.map()!.panTo(loc);
    this.map()!.setZoom(15);
  }
  onNewSpotRequested(areaId: number) {
    this.selectedAreaId.set(areaId);
    this.activeId.set(areaId);
    this.addSpotMode.set(true);
    setTimeout(() => this.addSpotPinCmp?.start());
  }

  private extractLogicalAreas(address: string | undefined) {
    if (!address) return [];

    const parts = address.split(' - ').map((p) => p.trim());

    const coreParts = parts.slice(1, -1);

    const meaningful = coreParts.filter((p) => p && !/^\d+$/.test(p));

    return meaningful.reverse().map((name, index) => ({
      id: index + 1,
      name,
    }));
  }
  onSpotConfirmed(
    location: {
      lat: number;
      lng: number;
      formatted_address?: string;
      place_id?: string;
      country?: string;
      city?: string;
      area?: string;
    } | null
  ) {
    const locationExtracted = this.extractLogicalAreas(location?.formatted_address);
    this.extractedLocationName.set(locationExtracted);
    this.spotAddLoaction.set(location);
    this.openAddSpotPanel();
    this.addSpotPinCmp?.frozen();
  }
  onSpotCreated() {
    this.api.get('/surveillance/areas/all').subscribe({
      next: (res: any) => {
        this.areas.set(res.data);
        const spots = collectSpots(res.data);
        this.allSpots.set(spots);
        this.closeAddSpotPanel();

        this.addSpotMode.set(false);
        this.addSpotPinCmp?.unfreeze();
      },
      error: (err) => {
        console.error('❌ Failed to reload areas:', err);
      },
    });
  }

  onAddSpotCancelled() {
    this.addSpotMode.set(false);
  }
  onNodeSelected(id: number) {
    this.activeId.set(id);
  }
  onEditStarted() {
    if (this.addSpotPanel?.isOpen()) {
      this.addSpotPanel.close();
    }
  }
}
