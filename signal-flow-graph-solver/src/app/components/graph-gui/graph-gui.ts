import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import cytoscape from 'cytoscape';
import { GraphInput } from '../../models/graph-input.model';
import { SolveAllService } from '../../services/SolveAll';
import is from '@angular/common/locales/extra/is';

@Component({
  selector: 'app-graph-gui',
  imports: [CommonModule],
  templateUrl: './graph-gui.html',
  styleUrls: ['./graph-gui.css'],
})
export class GraphGui implements AfterViewInit {
  @ViewChild('cy') cyContainer!: ElementRef;
  private cy!: cytoscape.Core;
  private nodecounter = 1;
  private edgecounter = 1;
  state = "Select";
  private sourceNode: any = null;
  public resultData: any = null; 
  public showResults = false;
  private graphInput:GraphInput | undefined ;

  constructor(private solver: SolveAllService) {}
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
            'font-weight': 'bold',
            'width': 40,
            'height': 40,
            "border-color": '#fff',
            "border-width": 2,
          },
        },
        {
          selector: 'edge',
          style: {
            width: 3,
            'line-color': '#ff4136',
            'target-arrow-color': '#ff4136',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(gain)',
            'text-rotation': 'autorotate',
            'text-margin-x': 0,
            'text-margin-y': -15,
            color: '#ffffff',
            'font-weight': 'bold',
            'control-point-step-size': 70,
          },
        },
        {
          selector: '.highlighted',
          style: {
            'background-color': '#22c55e',
            'line-color': '#22c55e',
            'target-arrow-color': '#22c55e',
            'border-color': '#a7f3d0',
            'border-width': 4,
            'line-width': 6,
            'transition-property': 'background-color, line-color, width, border-color, border-width',
            'transition-duration': '150ms',
          },
        },
        {
          selector: '.ghost',
          style: {
            'background-color': '#2ecc71',
            'opacity': 0.5,
            'label': ''
          }
      },
      {
        selector: '.selected-source',
        style: this.selectedSourceStyle
      },
      ],
      layout: {
        name: 'grid',
        rows: 1,
      },
    });
  this.cy.on('tap', (event) => {
  if (this.state === "AddNode") {
    if (event.target === this.cy || event.target.id() === 'ghost') {
      const pos = event.position;
      this.cy.add({
        group: 'nodes',
        data: { id: `n${this.nodecounter++}` },
        position: pos,
      });
    }
  }
  if (this.state === "Delete") {
    if (event.target !== this.cy) {
      event.target.remove();
    }
  }
  if (this.state === "Select" && event.target.isEdge() && event.target !== this.cy) {
    const gain = prompt('Enter new edge gain:', event.target.data('gain'));
    if (gain !== null && !isNaN(parseFloat(gain))) {
      event.target.data('gain', parseFloat(gain));
    } else {
      alert('Invalid gain value. Please enter a number.');
    }
  }
});
this.cy.on('tap','node', (event) => {
  if(this.state === "AddEdgeSource") {
    this.sourceNode = event.target;
    this.sourceNode.addClass('selected-source');
    this.state = "AddEdgeTarget";}
  else if (this.state === "AddEdgeTarget") {
        const targetNode = event.target;
        const gain = prompt('Enter edge gain:', '1');
          if (gain !== null && !isNaN(parseFloat(gain))) {
            const sourceId = this.sourceNode.id();
            const targetId = targetNode.id();
            const edgeGain = parseFloat(gain);
            const existingEdge = this.cy.edges(`[source="${sourceId}"][target="${targetId}"]`).first();
            if (existingEdge.length > 0) {
              const currentGain = parseFloat(existingEdge.data('gain')) || 0;
              existingEdge.data('gain', currentGain + edgeGain);
            } else {
            this.cy.add({
              group: 'edges',
              data: {
          id: `e${this.edgecounter++}_${sourceId}_${targetId}`, 
          source: sourceId, 
          target: targetId, 
          gain: edgeGain
        },});
            }
      }
      else {
        alert('Invalid gain value. Please enter a number.');
      }
        this.sourceNode.removeClass('selected-source');
        this.state = "AddEdgeSource";
  }});

this.cy.on('mousemove',  (event) => {
  if (this.state === "AddNode" ){
    const ghostNode = this.cy.getElementById('ghost');
      if (ghostNode.length > 0) {
        ghostNode.position(event.position);
      }
  }
});
}





  addNode() {
    this.state = "AddNode";
    if(this.cy.getElementById('ghost').length === 0) {
      this.cy.add({
        group: 'nodes',
        data: { id: 'ghost' },
        position: { x: -100, y: -100 },
        classes: 'ghost'
      });
    }
  }
  addEdge() {
    this.select();
    const nodes = this.cy.nodes();
    if (nodes.length < 2) {
      alert('Please add at least 2 nodes to create an edge.');
      return;
    }
    this.state = "AddEdgeSource";
  }
  select() {
    this.state = "Select";
    const ghostNode = this.cy.getElementById('ghost');
    if (ghostNode.length > 0) {
      ghostNode.remove();
    }
    if (this.sourceNode) {
    this.sourceNode.removeClass('selected-source');
    }
  }
  delete(){
    this.select();
    this.state = "Delete";
  }
  exportGraph() {
    this.select();
    const start = parseInt(prompt('Enter start node ID:') || '0');
    if (!this.cy.getElementById(`n${start}`).length) {
      alert('Invalid node ID. Please enter Valid node IDs.');
      return;
    }    
    const end = parseInt(prompt('Enter end node ID:') || '0');
    if (!this.cy.getElementById(`n${end}`).length) {
      alert('Invalid node ID. Please enter Valid node IDs.');
      return;
    }
    const elements = this.cy.edges().map(edge => ({ 
    from: parseInt(edge.data('source').replace('n', '')),
    to: parseInt(edge.data('target').replace('n', '')),
    gain: edge.data('gain')   
    }));
    const graphInput: GraphInput = { edges: elements , start: start, end: end };
    this.graphInput= graphInput;
    this.solveGraph(graphInput);
  }
  solveGraph(graphInput: GraphInput) {
    console.log('Graph Input:', graphInput);
    const result = this.solver.Solve(graphInput);
    this.resultData = result;
    this.showResults = true;
    console.log('Solver Output:', result);
  }
  private selectedSourceStyle: any = {
    'shadow-blur': 90,
    'shadow-color': '#fbbf24',
    'shadow-opacity': 0.5,
    'shadow-offset-x': 0,
    'shadow-offset-y': 0,
    'border-width': 6,
    'border-color': '#fbbf24'
};

highlightOnGraph(nodes: number[]) {
  this.cy.elements().removeClass('highlighted');
  this.highlightPath(nodes.map((n) => `n${n}`));
}

highlightMultiplePaths(loopPaths: Array<number[] | { nodes: number[] }>) {
  this.cy.elements().removeClass('highlighted');
  loopPaths.forEach((loopPath) => {
    const nodes = Array.isArray(loopPath) ? loopPath : loopPath.nodes;
    this.highlightPath(nodes.map((n) => `n${n}`));
  });
}

private highlightPath(nodeIds: string[]) {
  nodeIds.forEach((id, index) => {
    const node = this.cy.getElementById(id);
    if (node.length > 0) {
      node.addClass('highlighted');
    }
    if (index < nodeIds.length - 1) {
      const nextId = nodeIds[index + 1];
      const edge = this.cy.edges(`[source="${id}"][target="${nextId}"]`);
      if (edge.length > 0) {
        edge.addClass('highlighted');
      }
    }
  });
}
hideResults() {
  this.showResults = false;
  this.resultData = null;
  this.cy.elements().removeClass('highlighted');
  this.select();
}
exportGraphJSON(): void {
   this.select();
  let start = 0 ;
  let end = 0 ;
    const elements = this.cy.edges().map(edge => ({ 
    from: parseInt(edge.data('source').replace('n', '')),
    to: parseInt(edge.data('target').replace('n', '')),
    gain: edge.data('gain')   
    }));
    const graphInput: GraphInput = { edges: elements , start: start, end: end };
    this.graphInput= graphInput;

  // if(this.graphInput ===  undefined){
  //   console.log("undefined");
  //   return ;
  // }
  const graph: GraphInput = {
    edges: this.graphInput.edges,   
    start: this.graphInput.start,
    end: this.graphInput.end
  };

  const json = JSON.stringify(graph, null, 2);

  const blob = new Blob([json], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'graph.json';
  a.click();

  window.URL.revokeObjectURL(url);

}

importGraphJSON(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const g = JSON.parse(e.target?.result as string) as GraphInput;
      if (!g.edges?.length) { alert('Invalid JSON format.'); return; }
      this.cy.elements().remove();
      this.nodecounter = this.edgecounter = 1;
      const nodes = Array.from(new Set(g.edges.flatMap(e => [e.from, e.to]))).sort((a, b) => a - b);
      const cols = Math.ceil(Math.sqrt(nodes.length));
      nodes.forEach((n, i) => this.cy.add({ group: 'nodes', data: { id: `n${n}` }, position: { x: (i%cols)*100, y: Math.floor(i/cols)*100 } }));
      g.edges.forEach((e, i) => this.cy.add({ group: 'edges', data: { id: `e${i}`, source: `n${e.from}`, target: `n${e.to}`, gain: e.gain } }));
      this.graphInput = g;
      this.select();
      (event.target as HTMLInputElement).value = '';
      alert(`Imported: ${nodes.length} nodes, ${g.edges.length} edges`);
    } catch (error) {
      alert(`Import failed: ${error}`);
      (event.target as HTMLInputElement).value = '';
    }
  };
  reader.readAsText(file);
}

}
