import { Component, computed, effect, forwardRef, input, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectGroup } from '../../../core/models/formselectinput';

@Component({
  selector: 'app-form-multi-select',
  imports: [],
  templateUrl: './form-multi-select.html',
  styleUrl: './form-multi-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormMultiSelect),
      multi: true,
    },
  ],
})
export class FormMultiSelect {
  label = input<string>('');
  placeholder = input<string>('Select options');
  icon = input<string>('');
  required = input<boolean>(false);
  error = input<string | null>('');
  groups = input<SelectGroup[]>([]);
  selectedValues = signal<string[]>([]);
  isDisabled = signal<boolean>(false);
  isOpen = signal<boolean>(false);
  groupStates = signal<Map<string, boolean>>(new Map());

  displayText = computed(() => {
    const selected = this.selectedValues();
    if (selected.length === 0) return this.placeholder();
    if (selected.length === 1) {
      return this.getOptionLabel(selected[0]) || selected[0];
    }
    return `${selected.length} items selected`;
  });

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      const groupsList = this.groups();
      const states = new Map<string, boolean>();
      groupsList.forEach((group) => {
        states.set(group.groupLabel, group.collapsed ?? false);
      });
      this.groupStates.set(states);
    });
  }

  writeValue(value: any): void {
    if (Array.isArray(value)) {
      this.selectedValues.set(value);
    } else {
      this.selectedValues.set([]);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  toggleDropdown(): void {
    if (!this.isDisabled()) {
      this.isOpen.update((open) => !open);
      if (!this.isOpen()) {
        this.onTouched();
      }
    }
  }

  toggleGroup(groupLabel: string): void {
    const states = new Map(this.groupStates());
    states.set(groupLabel, !states.get(groupLabel));
    this.groupStates.set(states);
  }

  isGroupCollapsed(groupLabel: string): boolean {
    return this.groupStates().get(groupLabel) ?? false;
  }

  toggleOption(value: string): void {
    const current = this.selectedValues();
    const index = current.indexOf(value);

    let newValues: string[];
    if (index > -1) {
      newValues = current.filter((v) => v !== value);
    } else {
      newValues = [...current, value];
    }

    this.selectedValues.set(newValues);
    this.onChange(newValues);
  }

  isSelected(value: string): boolean {
    return this.selectedValues().includes(value);
  }

  removeValue(value: string, event: Event): void {
    event.stopPropagation();
    const newValues = this.selectedValues().filter((v) => v !== value);
    this.selectedValues.set(newValues);
    this.onChange(newValues);
  }

  getOptionLabel(value: string): string | null {
    for (const group of this.groups()) {
      const option = group.options.find((opt) => opt.value === value);
      if (option) return option.label;
    }
    return null;
  }

  closeDropdown(): void {
    this.isOpen.set(false);
    this.onTouched();
  }
}
