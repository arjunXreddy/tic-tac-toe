import { gameStore } from "../store/game-store";
import { generateGameCode } from "./game-code";
import { findWinner, isBoardFull } from "./game-logic";
import type { Game, Player } from "../types/game";

export class GameServiceError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "GameServiceError";
    this.statusCode = statusCode;
  }
}

function createEmptyBoard(): (Player | null)[] {
  return Array.from({ length: 9 }, () => null);
}

function normalizeCode(code: string): string {
  return code.trim().toUpperCase();
}

export function createGame(): Game {
  const now = new Date().toISOString();
  const game: Game = {
    code: generateGameCode(),
    board: createEmptyBoard(),
    turn: "X",
    status: "waiting",
    winner: null,
    createdAt: now,
    updatedAt: now,
  };

  gameStore.games.set(game.code, game);
  return game;
}

export function listGames(): Game[] {
  return [...gameStore.games.values()];
}

export function getGame(code: string): Game {
  const game = gameStore.games.get(normalizeCode(code));

  if (!game) {
    throw new GameServiceError("Game not found", 404);
  }

  return game;
}

export function joinGame(code: string): { player: Player; game: Game } {
  const game = getGame(code);

  if (game.status !== "waiting") {
    throw new GameServiceError("Game is no longer available to join", 409);
  }

  game.status = "playing";
  game.updatedAt = new Date().toISOString();

  return { player: "O", game };
}

export function makeMove(code: string, player: Player, position: number): Game {
  const game = getGame(code);

  if (game.status !== "playing") {
    throw new GameServiceError("Game is not in progress", 409);
  }

  if (game.turn !== player) {
    throw new GameServiceError(`It is ${game.turn}'s turn`, 409);
  }

  if (!Number.isInteger(position) || position < 0 || position > 8) {
    throw new GameServiceError("Position must be an integer from 0 to 8", 400);
  }

  const currentCell = game.board[position];

  if (currentCell !== null && currentCell !== undefined) {
    throw new GameServiceError("Position is already occupied", 409);
  }

  game.board[position] = player;
  game.updatedAt = new Date().toISOString();

  const winner = findWinner(game.board);

  if (winner) {
    game.status = "won";
    game.winner = winner;
  } else if (isBoardFull(game.board)) {
    game.status = "draw";
  } else {
    game.turn = player === "X" ? "O" : "X";
  }

  return game;
}
