export interface GamePoint {
  x: number;
  y: number;
}

export interface GameDragState {
  current: GamePoint;
  id: string;
  origin: GamePoint;
}

