import { Injectable } from '@angular/core';
import { Edge } from '../models/edge.model';
import { Path } from '../models/path.model';
import { GraphInput } from '../models/graph-input.model';
import { NonTouchingLoops } from '../models/NonTouching';
import { FinalSolverOutput } from '../models/Solver';
import { PathService } from './path.service';

@Injectable({
    providedIn: 'root'
})
export class SolveAllService {
          constructor(private PathService : PathService) { }

    Solve(Input: GraphInput): FinalSolverOutput {
        const forwardPaths = this.findForwardPaths(Input);
        console.log(forwardPaths);
        const individualLoops = this.findIndividualLoops(Input);
        const nonTouchingLoops = this.findNonTouchingLoops(individualLoops);
        const deltas = this.calculateDeltas(forwardPaths, individualLoops, nonTouchingLoops);
        const systemDelta = this.calculateSystemDelta(individualLoops, nonTouchingLoops);
        const transferFunction = this.calculateTransferFunction(forwardPaths, deltas, systemDelta);
       
    const finalOutput: FinalSolverOutput = {
      forwardPaths,
      individualLoops,
      nonTouchingLoops,
      deltas,
      systemDelta,
      transferFunction
    };
    console.log("from service" , finalOutput ); 
    return finalOutput;



        // example output for testing and UI remove it when you implement the logic
        // return {

        //         forwardPaths: [
        //             { nodes: [1, 2, 3, 4, 5, 6], gain: 12.575 },
        //             { nodes: [1, 2, 4, 6], gain: 0.85 },
        //             { nodes: [1, 5, 6], gain: 2.3333 }
        //         ],

        //         individualLoops: [
        //             { nodes: [2, 3, 2], gain: -0.5 },
        //             { nodes: [4, 5, 4], gain: -1.2 },
        //             { nodes: [6, 6], gain: -0.15 },
        //             { nodes: [1, 2, 5, 1], gain: -3.4 }
        //         ],

        //         nonTouchingLoops: [
        //             {
        //                 degree: 2,
        //                 combinations: [
        //                     [{nodes:[2, 3, 2],gain:-0.5},{nodes:[4, 5, 4],gain:-1.2}], 
        //                     [{nodes:[2, 3, 2],gain:-0.5},{nodes:[6, 6],gain:-0.15}],
        //                     [{nodes:[4, 5, 4],gain:-1.2},{nodes:[6, 6],gain:-0.15}]    
        //                 ]
        //             },
        //             {
        //                 degree: 3,
        //                 combinations: [
        //                     [{nodes:[2, 3, 2],gain:-0.5},{nodes:[4, 5, 4],gain:-1.2},{nodes:[6, 6],gain:-0.15}]
        //                 ]
        //             }
        //         ],
        //         deltas: [1.35, 1.0, 0.957],
                
        //         systemDelta: 15.7825,
                
        //         transferFunction: 1.1245678
        //     };
    }


    
    findForwardPaths(input: GraphInput): Path[] {
        // Implement the logic to find forward paths using the PathService
       return this.PathService.findForwardPaths(input);
    }

    findIndividualLoops(input: GraphInput): Path[] {
        // Implement the logic to find individual loops in the graph for best implementation you can add new service to handle loops and call it here
 const adjacency = this.buildAdjacency(input.edges);
    const uniqueLoops = new Map<string, Path>();

    const allNodes = this.getAllNodes(input.edges);

    for (const startNode of allNodes) {
      const visited = new Set<number>();
      visited.add(startNode);

      const dfs = (current: number, pathNodes: number[], currentGain: number) => {
        const outgoing = adjacency.get(current) || [];

        for (const edge of outgoing) {
          const next = this.getTo(edge);
          const edgeGain = this.getGain(edge);

          if (next === startNode) {
            const cycleNodes = [...pathNodes, startNode];
            const cycleGain = currentGain * edgeGain;

            const normalized = this.normalizeLoop(cycleNodes, cycleGain);
            const key = this.loopKey(normalized.nodes);

            if (!uniqueLoops.has(key)) {
              uniqueLoops.set(key, normalized);
            }
            continue;
          }

          if (visited.has(next)) continue;

          visited.add(next);
          pathNodes.push(next);

          dfs(next, pathNodes, currentGain * edgeGain);

          pathNodes.pop();
          visited.delete(next);
        }
      };

      dfs(startNode, [startNode], 1);
    }

    return Array.from(uniqueLoops.values());    }

    findNonTouchingLoops(individualLoops: Path[]): NonTouchingLoops[] {
        // Implement the logic to identify non-touching loops and group them by degree you can add new service to handle non-touching loops and call it here
       const result: NonTouchingLoops[] = [];
    const grouped = new Map<number, Path[][]>();

    const loopNodeSets = individualLoops.map(loop => this.getLoopNodeSet(loop));

    const backtrack = (startIndex: number, chosen: Path[], chosenNodeSet: Set<number>) => {
      if (chosen.length >= 2) {
        const degree = chosen.length;
        if (!grouped.has(degree)) {
          grouped.set(degree, []);
        }
        grouped.get(degree)!.push(chosen.map(loop => ({ ...loop, nodes: [...loop.nodes] })));
      }

      for (let i = startIndex; i < individualLoops.length; i++) {
        const loop = individualLoops[i];
        const loopSet = loopNodeSets[i];

        if (this.areSetsDisjoint(chosenNodeSet, loopSet)) {
          const newSet = new Set<number>([...chosenNodeSet, ...loopSet]);
          chosen.push(loop);
          backtrack(i + 1, chosen, newSet);
          chosen.pop();
        }
      }
    };

    backtrack(0, [], new Set<number>());

    const degrees = Array.from(grouped.keys()).sort((a, b) => a - b);
    for (const degree of degrees) {
      result.push({
        degree,
        combinations: grouped.get(degree)!
      });
    }

    return result;
    }

    calculateDeltas(forwardPaths: Path[], individualLoops: Path[], nonTouchingLoops: NonTouchingLoops[]): number[] {
        // Implement the logic to calculate deltas for each forward path for best implementation you can add new service to handle deltas calculation and call it here
       const deltas: number[] = [];

    for (const forwardPath of forwardPaths) {
      const pathNodeSet = new Set<number>(forwardPath.nodes);

      const validIndividualLoops = individualLoops.filter(loop =>
        this.isLoopNonTouchingWithPath(loop, pathNodeSet)
      );

      const validNonTouchingLoops: NonTouchingLoops[] = [];

      for (const group of nonTouchingLoops) {
        const validCombinations = group.combinations.filter(combo =>
          combo.every(loop => this.isLoopNonTouchingWithPath(loop, pathNodeSet))
        );

        if (validCombinations.length > 0) {
          validNonTouchingLoops.push({
            degree: group.degree,
            combinations: validCombinations
          });
        }
      }

      deltas.push(this.calculateDeltaFromLoops(validIndividualLoops, validNonTouchingLoops));
    }

    return deltas;
    }

    calculateSystemDelta(individualLoops: Path[], nonTouchingLoops: NonTouchingLoops[]): number {
        // Implement the logic to calculate the overall system delta for best implementation you can add new service to handle system delta calculation and call it here
        return this.calculateDeltaFromLoops(individualLoops,nonTouchingLoops);
        
    }

    calculateTransferFunction(forwardPaths: Path[], deltas: number[], systemDelta: number): number {
        // Implement the logic to calculate the overall transfer function using Mason's Gain Formula
        let numerator = 0 ;
        for ( let i = 0 ; i < forwardPaths.length ; i ++){
          numerator += forwardPaths[i].gain * deltas[i] ;
        }
        return numerator / systemDelta ;
    }
     private buildAdjacency(edges: Edge[]): Map<number, Edge[]> {
    const adjacency = new Map<number, Edge[]>();

    for (const edge of edges) {
      const from = this.getFrom(edge);
      if (!adjacency.has(from)) {
        adjacency.set(from, []);
      }
      adjacency.get(from)!.push(edge);
    }

    return adjacency;
  }

  private getAllNodes(edges: Edge[]): number[] {
    const nodes = new Set<number>();

    for (const edge of edges) {
      nodes.add(this.getFrom(edge));
      nodes.add(this.getTo(edge));
    }

    return Array.from(nodes).sort((a, b) => a - b);
  }

  private getFrom(edge: Edge): number {
    const e: any = edge;
    return e.from ?? e.source ?? e.start;
  }

  private getTo(edge: Edge): number {
    const e: any = edge;
    return e.to ?? e.target ?? e.end;
  }

  private getGain(edge: Edge): number {
    const e: any = edge;
    return e.gain;
  }

  private normalizeLoop(loopNodes: number[], gain: number): Path {
   
    const base = loopNodes.slice(0, -1);

    let bestRotation = [...base];

    for (let i = 1; i < base.length; i++) {
      const rotated = [...base.slice(i), ...base.slice(0, i)];
      if (this.compareArrays(rotated, bestRotation) < 0) {
        bestRotation = rotated;
      }
    }

    return {
      nodes: [...bestRotation, bestRotation[0]],
      gain
    };
  }

  private loopKey(loopNodes: number[]): string {
    return loopNodes.join('->');
  }

  private compareArrays(a: number[], b: number[]): number {
    const len = Math.min(a.length, b.length);

    for (let i = 0; i < len; i++) {
      if (a[i] < b[i]) return -1;
      if (a[i] > b[i]) return 1;
    }

    return a.length - b.length;
  }

  private getLoopNodeSet(loop: Path): Set<number> {
    return new Set(loop.nodes.slice(0, -1));
  }

  private areSetsDisjoint(a: Set<number>, b: Set<number>): boolean {
    for (const value of b) {
      if (a.has(value)) return false;
    }
    return true;
  }

  private isLoopNonTouchingWithPath(loop: Path, pathNodeSet: Set<number>): boolean {
    const loopSet = this.getLoopNodeSet(loop);

    for (const node of loopSet) {
      if (pathNodeSet.has(node)) return false;
    }

    return true;
  }

  private calculateDeltaFromLoops(individualLoops: Path[], nonTouchingLoops: NonTouchingLoops[]): number {
    let delta = 1;

    const sumIndividual = individualLoops.reduce((sum, loop) => sum + loop.gain, 0);
    delta -= sumIndividual;

    
    for (const group of nonTouchingLoops) {
      let groupSum = 0;

      for (const combo of group.combinations) {
        let product = 1;
        for (const loop of combo) {
          product *= loop.gain;
        }
        groupSum += product;
      }

      if (group.degree % 2 === 0) {
        delta += groupSum;
      } else {
        delta -= groupSum;
      }
    }

    return delta;
  }
}




