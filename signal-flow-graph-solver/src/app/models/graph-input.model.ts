import { Edge } from "./edge.model";
export interface GraphInput {
  edges: Edge[];
  start: number;
  end: number;
}