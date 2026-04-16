import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PathDetector } from "./components/path-detector/path-detector";



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PathDetector],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('signal-flow-graph-solver');
}
