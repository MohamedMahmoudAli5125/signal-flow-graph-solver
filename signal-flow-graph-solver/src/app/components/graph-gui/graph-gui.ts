import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import cytoscape from 'cytoscape';

@Component({
  selector: 'app-graph-gui',
  imports: [],
  templateUrl: './graph-gui.html',
  styleUrl: './graph-gui.css',
})
export class GraphGui implements AfterViewInit {
  @ViewChild('cy') cyContainer!: ElementRef;
  private cy!: cytoscape.Core;
  private nodecounter = 1;
  private state = "Select";

  ngAfterViewInit() {
    this.initCytoscape();
  }

  private initCytoscape() {
    this.cy = cytoscape({
      container: this.cyContainer.nativeElement,
      elements: [],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#0074D9',
            label: 'data(id)',
            color: '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': '#ff4136',
            'target-arrow-color': '#ff4136',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(gain)',
            'text-rotation': 'autorotate',
            'text-margin-x': 0,
            'text-margin-y': -10,
          },
        },
      ],
      layout: {
        name: 'grid',
        rows: 1,
      },
    });
  this.cy.on('tap', (event) => {
  if (this.state === "AddNode") {
    if (event.target === this.cy) {
      const pos = event.position;
      this.cy.add({
        group: 'nodes',
        data: { id: `n${this.nodecounter++}` },
        position: pos,
      });
    }
    this.state = "Select";
  }
});
}





  addNode() {
    this.state = "AddNode";
  }
  addEdge() {
    const nodes = this.cy.nodes();
    if (nodes.length < 2) {
      alert('Please add at least 2 nodes to create an edge.');
      return;
    }
    const source = nodes[0];
    const target = nodes[1];
    this.cy.add({
      group: 'edges',
      data: { source: source.id(), target: target.id(), gain: Math.random() * 10 },
    });
  }

}
