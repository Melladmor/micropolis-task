import {
  Component,
  ElementRef,
  signal,
  computed,
  inject,
  OnInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuService } from '../../core/services/context-menu-service';
import { ContextAction } from '../../core/models/contextmenu';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './context-menu.html',
  styleUrls: ['./context-menu.scss'],
})
export class ContextMenu implements OnInit, OnDestroy {
  private host = inject(ElementRef);
  private renderer = inject(Renderer2);
  private globalService = inject<ContextMenuService>(ContextMenuService);

  visible = signal(false);
  actions = signal<ContextAction[]>([]);
  list = computed(() => this.actions());

  private ignoreNextClick = false;

  private handleClickOutside = (e: MouseEvent) => {
    if (this.ignoreNextClick) {
      this.ignoreNextClick = false;
      return;
    }

    const menuEl = this.host.nativeElement.querySelector('.context-menu') as HTMLElement;
    if (menuEl && !menuEl.contains(e.target as Node)) {
      this.close();
    }
  };

  private handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.close();
  };

  ngOnInit() {
    this.globalService.register(this);
    const el = this.host.nativeElement;
    this.renderer.appendChild(document.body, el);

    document.addEventListener('click', this.handleClickOutside);
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
    document.removeEventListener('keydown', this.handleEscapeKey);
    const el = this.host.nativeElement;
    if (el.parentNode) el.parentNode.removeChild(el);
  }

  open(x: number, y: number, actions: ContextAction[]) {
    this.actions.set(actions);
    this.visible.set(true);

    setTimeout(() => {
      const el = this.host.nativeElement.querySelector('.context-menu') as HTMLElement;
      if (!el) return;

      const width = 220;
      const height = actions.length * 35;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      if (x + width > screenW) x = screenW - width - 10;
      if (y + height > screenH) y = screenH - height - 10;

      el.style.top = y + 'px';
      el.style.left = x + 'px';
    }, 0);
  }

  close() {
    this.visible.set(false);
  }

  select(action: ContextAction) {
    if (action.disabled || action.divider) return;
    action.action?.();
    this.close();
  }
}
