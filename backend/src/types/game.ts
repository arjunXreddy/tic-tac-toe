export type Player = "X" | "O";

export type GameStatus = "waiting" | "playing" | "won" | "draw";

export interface Game {
  code: string;
  board: (Player | null)[];
  turn: Player;
  status: GameStatus;
  winner: Player | null;
  createdAt: string;
  updatedAt: string;
}
