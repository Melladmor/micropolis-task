import { Component, effect, inject, input, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Forminput } from '../form/forminput/forminput';
import { FormMultiSelect } from '../form/form-multi-select/form-multi-select';
import { SelectGroup } from '../../core/models/formselectinput';
import { FormCheckbox } from '../form/form-checkbox/form-checkbox';
import { ApiService } from '../../core/services/api.service';
import {
  SpotBusinessConfigItem,
  SpotBusinessConfigResponse,
  SpotBusinessConfigCheckBoxData,
  SpotResponse,
  SpotTagResponse,
} from '../../core/models/addspotform';
import { tap } from 'rxjs';
import { TreeItem } from '../tree-item/tree-item';

@Component({
  selector: 'app-spot-form',
  imports: [ReactiveFormsModule, Forminput, FormMultiSelect, FormCheckbox],
  templateUrl: './spot-form.html',
  styleUrl: './spot-form.scss',
})
export class SpotForm {
  @ViewChild(TreeItem) treeItemCmp?: TreeItem;

  form: FormGroup;
  spotCreated = output<void>();
  areaId = input<number | null | undefined>(null);

  api = inject(ApiService);
  tags = signal<SelectGroup[] | null>(null);
  cameraType = signal<SelectGroup[] | null>(null);
  landMark = signal<SelectGroup[] | null>(null);
  businessConfigurationItems = signal<SpotBusinessConfigCheckBoxData[] | null>(null);
  businessControlName = signal<string[] | null>(null);
  selectedBusinessConfigs = signal<SpotBusinessConfigCheckBoxData[]>([]);
  error = signal<Error | null>(null);
  location = input<{
    lat: number;
    lng: number;
    formatted_address?: string;
    place_id?: string;
    country?: string;
    city?: string;
    area?: string;
  } | null>(null);
  formatLabel(key: string): string {
    return key
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  loadCameras() {
    this.api
      .post<SpotResponse>('surveillance/spot-categories', {
        paginator: {
          start: 1,
          length: 1000,
        },
        searchTerm: 'Building',
      })
      .subscribe({
        next: (res) => {
          const items = res?.data?.items || [];
          const data = items.map((item) => ({
            groupLabel: item.name,
            options: item.spotSubCategories?.map((subtag) => {
              return { label: subtag?.name, value: String(subtag.id) };
            }),
          }));

          this.cameraType.set(data);
        },
        error: (err) => {
          console.error('API error:', err);
          this.api.error.set(err);
        },
      });
  }
  loadLandMark() {
    this.api
      .post<SpotTagResponse>('surveillance/spot-tags', {
        paginator: {
          start: 1,
          length: 1000,
        },
        searchTerm: 'Landmark',
      })
      .subscribe({
        next: (res) => {
          const items = res?.data?.items || [];
          const data = items.map((item) => ({
            groupLabel: item.name,
            id: item.id,
            options: item.spotSubTags?.map((subtag) => {
              return { label: subtag?.name, value: String(subtag.id) };
            }),
          }));

          this.landMark.set(data);
        },
        error: (err) => {
          console.error('API error:', err);
          this.api.error.set(err);
        },
      });
  }

  loadTags() {
    this.api
      .post<SpotTagResponse>('surveillance/spot-tags', {
        paginator: {
          start: 1,
          length: 1000,
        },
        searchTerm: 'Critical',
      })
      .subscribe({
        next: (res) => {
          const items = res?.data?.items || [];
          const data = items.map((item) => ({
            groupLabel: item.name,
            options: item.spotSubTags?.map((subtag) => {
              return { label: subtag?.name, value: String(subtag.id) };
            }),
          }));

          this.tags.set(data);
        },
        error: (err) => {
          console.error('API error:', err);
          this.api.error.set(err);
        },
      });
  }
  loadBusinessConfigration() {
    this.api.get<SpotBusinessConfigResponse>('surveillance/business-configuration').subscribe({
      next: (res) => {
        const data = res?.data;
        const result = data?.map((item: SpotBusinessConfigItem) => {
          return {
            id: item?.id,
            label: this.formatLabel(item?.key),
            value: item?.value,
            options: item?.defaultOptions,
          };
        });
        const configNames = data?.map((item: SpotBusinessConfigItem) => {
          return item?.key;
        });
        this.businessConfigurationItems.set(result);
        this.businessControlName.set(configNames);
      },
      error: (err) => {
        console.error('API error:', err);
        this.api.error.set(err);
      },
    });
  }
  private cleanAddress(address: string): string {
    return address.replace(/^[A-Z0-9]{4,}\+[A-Z0-9]{2,}\s*/i, '').trim();
  }
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      ip: ['192.168.1.1', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      cameraType: [[], Validators.required],
      landmarks: [''],
      critical: [[], Validators.required],
      faceAnalysis: [true],
      personAnalysis: [true],
      sceneAnalysis: [false],
    });
    effect(() => {
      const loc = this.location();
      if (loc) {
        const cleanName = loc.formatted_address ? this.cleanAddress(loc.formatted_address) : '';

        this.form.patchValue({
          name: cleanName,
          location: loc.area || '',
        });
      }
    });
  }

  onToggleChange(item: SpotBusinessConfigCheckBoxData, isChecked: boolean) {
    this.form.get(item?.label)?.setValue(isChecked);

    const updatedItem = { ...item, value: String(isChecked) };
    const current = this.selectedBusinessConfigs();
    const exists = current.find((i) => i.id === item.id);

    if (exists) {
      this.selectedBusinessConfigs.update((list) =>
        list.map((i) => (i.id === item.id ? updatedItem : i))
      );
    } else {
      this.selectedBusinessConfigs.update((list) => [...list, updatedItem]);
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const originalItems = this.businessConfigurationItems() || [];
    const modifiedItems = this.selectedBusinessConfigs() || [];
    const mergedConfigs = originalItems.map((item) => {
      const modified = modifiedItems.find((m) => m.id === item.id);
      return modified ? modified : item;
    });

    const spotSubTags: { tag?: number | string; subTags: string[] }[] = (this.landMark() || [])
      .map((group) => {
        const selectedSubs = group.options
          .filter((opt) => formValue.landmarks.includes(opt.value))
          .map((opt) => opt.label);

        if (selectedSubs.length > 0) {
          return {
            tag: group?.id,
            subTags: selectedSubs,
          };
        }
        return null;
      })
      .filter((tag) => tag !== null);

    const payload = {
      name: formValue.name,
      code: this.location()?.place_id,
      latitude: this.location()?.lat,
      longitude: this.location()?.lng,
      ptz: true,
      spotSubCategories: formValue.cameraType.map((id: string) => Number(id)),
      spotSubTags: spotSubTags,
      host: formValue.ip,
      username: formValue.username,
      password: formValue.password,
      areaId: this.areaId(),
      spotBusinessConfigValues: mergedConfigs,
    };
    this.api
      .post('surveillance/spots/create', payload)
      .pipe(
        tap({
          next: (res) => {
            this.spotCreated.emit();
          },
          error: (err: Error) => {
            this.error.set(err);
          },
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.loadCameras();
    this.loadLandMark();
    this.loadTags();
    this.loadBusinessConfigration();
    this.form.statusChanges.subscribe(() => {});
    this.form.valueChanges.subscribe(() => {});
  }
}
