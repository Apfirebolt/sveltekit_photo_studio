export interface IFilterDocument {
  filterId: string;
  title: string;
  description: string;
  category: string;
  type: "canvas" | "tensorflow";
  css?: string;
  embedding: number[];
  tags: string[];
}

export type SketchFamily =
  | "graphite"
  | "charcoal"
  | "contour"
  | "hatching"
  | "engraving"
  | "stippling"
  | "technical";
export type SketchFilter = { family: SketchFamily; variation: number };
export type CartoonFilter = {
  blurSize: number;
  colorLevels: number;
  edgeThreshold: number;
  edgeStrength: number;
  saturation: number;
  inkColor: [number, number, number];
};
export type FilterDefinition = {
  id: string;
  name: string;
  type: "canvas" | "tensorflow";
  css?: string;
  sketch?: SketchFilter;
  cartoon?: CartoonFilter;
};
