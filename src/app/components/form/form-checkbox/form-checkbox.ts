import { Component, input, output, signal, effect } from '@angular/core';

@Component({
  selector: 'app-form-checkbox',
  imports: [],
  templateUrl: './form-checkbox.html',
  styleUrl: './form-checkbox.scss',
})
export class FormCheckbox {
  label = input<string>('');
  disabled = input<boolean>(false);
  checkedInput = input<boolean>(false);
  toggleChange = output<boolean>();

  checked = signal(false);

  constructor() {
    effect(() => {
      this.checked.set(this.checkedInput());
    });
  }

  toggle(): void {
    if (this.disabled()) return;

    const newValue = !this.checked();
    this.checked.set(newValue);
    this.toggleChange.emit(newValue);
  }
}
