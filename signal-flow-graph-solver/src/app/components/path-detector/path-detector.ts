
import { Component } from '@angular/core';
import { PathService } from '../../services/path.service';
import { GraphInput } from '../../models/graph-input.model';
import { Path } from '../../models/path.model';
import { Edge } from '../../models/edge.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-path-detector',
  templateUrl: './path-detector.html',
  imports: [CommonModule, FormsModule]
})
export class PathDetector {
  inputText: string = `1 2 1
2 3 5
3 4 2
1 3 10`;

  start = 1;
  end = 4;
  paths: Path[] = [];
  constructor(private pathService: PathService) {}

compute() {
  const edges: Edge[] = [];
  const lines = this.inputText.split('\n');

  for (let line of lines) {
    line = line.trim();
    if (line === "") continue; 
    const parts = line.split(' '); 
    edges.push({
      from: Number(parts[0]),
      to: Number(parts[1]),
      gain: Number(parts[2])
    });
  }
  
  const input: GraphInput = {
    edges: edges,
    start: this.start,
    end: this.end
  };

  this.paths = this.pathService.findForwardPaths(input);
}
}