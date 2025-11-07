import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContextMenu } from './components/context-menu/context-menu';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ContextMenu],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('micropolis-task');
}
