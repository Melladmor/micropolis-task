import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-button.html',
  styleUrls: ['./floating-button.scss'],
})
export class FloatingButton {
  label = input<string>('Button');
  color = input<string>('#000');
  textColor = input<string>('#fff');

  additionalStyle = input<Record<string, string>>({});

  top = input<number | null>(null);
  bottom = input<number | null>(null);
  left = input<number | null>(null);
  right = input<number | null>(null);

  clicked = output<void>();

  onClick() {
    this.clicked.emit();
  }

  get positionStyle(): Record<string, string> {
    const style: Record<string, string> = {
      position: 'absolute',
      'background-color': this.color(),
      color: this.textColor(),
      'z-index': '1000',
      ...this.additionalStyle(),
    };

    if (this.top() !== null) style['top'] = `${this.top()}%`;
    if (this.bottom() !== null) style['bottom'] = `${this.bottom()}%`;
    if (this.left() !== null) style['left'] = `${this.left()}px`;
    if (this.right() !== null) style['right'] = `${this.right()}px`;

    return style;
  }
}
