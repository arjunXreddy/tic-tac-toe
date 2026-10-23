import type { Player } from "../types/game";

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export function findWinner(board: readonly (Player | null)[]): Player | null {
  for (const [firstIndex, secondIndex, thirdIndex] of WINNING_LINES) {
    const first = board[firstIndex];

    if (
      first !== null &&
      first !== undefined &&
      first === board[secondIndex] &&
      first === board[thirdIndex]
    ) {
      return first;
    }
  }

  return null;
}

export function isBoardFull(board: readonly (Player | null)[]): boolean {
  return board.every((cell) => cell !== null);
}
