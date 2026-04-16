import { Injectable } from '@angular/core';
import { Edge } from '../models/edge.model';
import { Path } from '../models/path.model';
import { GraphInput } from '../models/graph-input.model';

@Injectable({
  providedIn: 'root'
})
export class PathService {
  private allPaths: Path[] = [];
  private adjList: any = {}; 

  findForwardPaths(input: GraphInput): Path[] {
    this.allPaths = [];
    this.adjList = this.buildAdjList(input.edges);
    const visitedNodes = new Set<number>();
    const currentPath: number[] = [];

    this.detectPathsRecursive(input.start, input.end, currentPath, visitedNodes, 1);
    return this.allPaths;
  }

  private detectPathsRecursive(current: number, end: number, path: number[], visited: Set<number>, gain: number) {
    path.push(current);
    visited.add(current);

    if (current === end) {
      this.allPaths.push({
        nodes: [...path], //shallow copy 
        gain: gain
      });
    } else {
      const neighbors = this.adjList[current] || [];
      for (let i = 0; i < neighbors.length; i++) {
        const edge = neighbors[i];
        
        if (!visited.has(edge.to)) {
          this.detectPathsRecursive(edge.to, end, path, visited, gain * edge.gain);
        }
      }
    }

    path.pop();
    visited.delete(current);
  }

  private buildAdjList(edges: Edge[]): any {
    const list: any = {};
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      if (!list[e.from]) {
        list[e.from] = [];
      }
      list[e.from].push(e);
    }
    return list;
  }
}