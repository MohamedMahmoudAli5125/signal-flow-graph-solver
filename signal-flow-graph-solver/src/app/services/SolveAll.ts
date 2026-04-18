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
    
    Solve(Input: GraphInput): FinalSolverOutput {
        const forwardPaths = this.findForwardPaths(Input);
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



        // example output for testing and UI remove it when you implement the logic
        return {

                forwardPaths: [
                    { nodes: [1, 2, 3, 4, 5, 6], gain: 12.575 },
                    { nodes: [1, 2, 4, 6], gain: 0.85 },
                    { nodes: [1, 5, 6], gain: 2.3333 }
                ],

                individualLoops: [
                    { nodes: [2, 3, 2], gain: -0.5 },
                    { nodes: [4, 5, 4], gain: -1.2 },
                    { nodes: [6, 6], gain: -0.15 },
                    { nodes: [1, 2, 5, 1], gain: -3.4 }
                ],

                nonTouchingLoops: [
                    {
                        degree: 2,
                        combinations: [
                            [{nodes:[2, 3, 2],gain:-0.5},{nodes:[4, 5, 4],gain:-1.2}], 
                            [{nodes:[2, 3, 2],gain:-0.5},{nodes:[6, 6],gain:-0.15}],
                            [{nodes:[4, 5, 4],gain:-1.2},{nodes:[6, 6],gain:-0.15}]    
                        ]
                    },
                    {
                        degree: 3,
                        combinations: [
                            [{nodes:[2, 3, 2],gain:-0.5},{nodes:[4, 5, 4],gain:-1.2},{nodes:[6, 6],gain:-0.15}]
                        ]
                    }
                ],
                deltas: [1.35, 1.0, 0.957],
                
                systemDelta: 15.7825,
                
                transferFunction: 1.1245678
            };
    }


    
    findForwardPaths(input: GraphInput): Path[] {
        // Implement the logic to find forward paths using the PathService
        return [];
    }

    findIndividualLoops(input: GraphInput): Path[] {
        // Implement the logic to find individual loops in the graph for best implementation you can add new service to handle loops and call it here
        return [];
    }

    findNonTouchingLoops(individualLoops: Path[]): NonTouchingLoops[] {
        // Implement the logic to identify non-touching loops and group them by degree you can add new service to handle non-touching loops and call it here
        return [];
    }

    calculateDeltas(forwardPaths: Path[], individualLoops: Path[], nonTouchingLoops: NonTouchingLoops[]): number[] {
        // Implement the logic to calculate deltas for each forward path for best implementation you can add new service to handle deltas calculation and call it here
        return [];
    }

    calculateSystemDelta(individualLoops: Path[], nonTouchingLoops: NonTouchingLoops[]): number {
        // Implement the logic to calculate the overall system delta for best implementation you can add new service to handle system delta calculation and call it here
        return 0;
    }

    calculateTransferFunction(forwardPaths: Path[], deltas: number[], systemDelta: number): number {
        // Implement the logic to calculate the overall transfer function using Mason's Gain Formula
        return 0;
    }

}