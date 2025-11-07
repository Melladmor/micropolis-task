import { Component, input, output, signal, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-panel.html',
  styleUrls: ['./floating-panel.scss'],
})
export class FloatingPanel {
  isOpen = signal(false);

  side = input<'left' | 'right'>('right');

  width = input<string>('537px');

  closed = output<void>();

  toggle() {
    this.isOpen.set(!this.isOpen());
  }

  close() {
    this.isOpen.set(false);
    this.closed.emit();
  }

  open() {
    this.isOpen.set(true);
  }
  panelElement: HTMLElement | null = null;
  private resizeObserver: ResizeObserver;

  constructor(private elementRef: ElementRef) {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const totalWidth = (entry as any).borderBoxSize?.[0]?.inlineSize || entry.contentRect.width;
        this._currentWidth.set(Math.round(totalWidth));
      }
    });
  }

  ngAfterViewInit() {
    this.panelElement = this.elementRef.nativeElement.querySelector('.floating-panel');
    if (this.panelElement) {
      this.resizeObserver.observe(this.panelElement);
      this._currentWidth.set(this.panelElement.offsetWidth);

      this.checkViewportWidth();
      window.addEventListener('resize', () => this.checkViewportWidth());
    }
  }

  private checkViewportWidth() {
    if (this.panelElement) {
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      let newWidth: string;

      if (vw > 1200) {
        newWidth = this.width();
      } else if (vw > 768) {
        newWidth = `min(500px, calc(100vw - 60px))`;
      } else {
        newWidth = `min(440px, calc(100vw - 40px))`;
      }

      this.panelElement.style.setProperty('--panel-width', newWidth);
      this._currentWidth.set(this.panelElement.offsetWidth);
    }
  }

  ngOnDestroy() {
    if (this.panelElement) {
      this.resizeObserver.unobserve(this.panelElement);
    }
    this.resizeObserver.disconnect();
  }

  private updatePanelWidth() {
    if (this.panelElement) {
      this._currentWidth.set(this.panelElement.offsetWidth);
    }
  }

  private _currentWidth = signal<number>(0);
  currentWidth = this._currentWidth.asReadonly();

  getPanelWidth() {
    const panel = this.panelElement;
    if (!panel) return 0;
    const panelWidth = panel.offsetWidth || parseInt(this.width(), 10) || 0;
    return panelWidth;
  }
}
