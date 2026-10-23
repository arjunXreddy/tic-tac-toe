import type { Game } from "../types/game";

interface GameStore {
  games: Map<string, Game>;
}

const globalForStore = globalThis as typeof globalThis & {
  __gameStore?: GameStore;
};

export const gameStore: GameStore = globalForStore.__gameStore ?? {
  games: new Map<string, Game>(),
};

globalForStore.__gameStore = gameStore;
