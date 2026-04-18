import { Path } from "./path.model";
import { NonTouchingLoops } from "./NonTouching";

export interface FinalSolverOutput {
    forwardPaths: Path[];
    individualLoops: Path[];
    nonTouchingLoops: NonTouchingLoops[]; 
    deltas: number[];
    systemDelta: number;
    transferFunction: number;
    }