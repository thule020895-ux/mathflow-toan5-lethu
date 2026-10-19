
export type ShapeType = 'triangle' | 'trapezoid' | 'circle' | 'rect_prism' | 'cube';

export interface ShapeData {
  type: ShapeType;
  params: {
    [key: string]: number;
  };
  unit: string;
}

export interface DrawingAction {
  points: { x: number; y: number }[];
  color: string;
}
