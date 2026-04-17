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
  private edgecounter = 1;
  state = "Select";
  private sourceNode: any = null;

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
          selector: '.ghost',
          style: {
            'background-color': '#2ecc71',
            'opacity': 0.5,
            'label': ''
          }
      },
      {
        selector: '.selected-source',
        style: selectedSourceStyle
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
  if (this.state === "Select" && event.target.isEdge()) {
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
            this.cy.add({
              group: 'edges',
              data: {
        id: `e${this.edgecounter++}_${this.sourceNode.id()}_${targetNode.id()}`, 
        source: this.sourceNode.id(), 
        target: targetNode.id(), 
        gain: parseFloat(gain)
        },});
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

}
const selectedSourceStyle: any = {
    'shadow-blur': 90,
    'shadow-color': '#fbbf24',
    'shadow-opacity': 0.5,
    'shadow-offset-x': 0,
    'shadow-offset-y': 0,
    'border-width': 6,
    'border-color': '#fbbf24'
};
