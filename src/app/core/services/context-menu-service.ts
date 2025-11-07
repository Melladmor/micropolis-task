import { Injectable } from '@angular/core';
import { ContextMenu } from '../../components/context-menu/context-menu';
import { ContextAction } from '../models/contextmenu';

@Injectable({
  providedIn: 'root',
})
export class ContextMenuService {
  private instance?: ContextMenu;

  register(menu: ContextMenu) {
    this.instance = menu;
  }

  open(x: number, y: number, actions: ContextAction[]) {
    this.instance?.open(x, y, actions);
  }

  close() {
    this.instance?.close();
  }
}
