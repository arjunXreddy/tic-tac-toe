import { randomInt } from "node:crypto";
import { gameStore } from "../store/game-store";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 6;
const MAX_ATTEMPTS = 100;

export function generateGameCode(): string {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    let code = "";

    for (let index = 0; index < CODE_LENGTH; index += 1) {
      code += CODE_ALPHABET.charAt(randomInt(CODE_ALPHABET.length));
    }

    if (!gameStore.games.has(code)) {
      return code;
    }
  }

  throw new Error("Unable to generate a unique game code");
}
