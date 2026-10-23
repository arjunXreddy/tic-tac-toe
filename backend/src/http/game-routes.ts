import { Router } from "express";
import type { Request, Response } from "express";
import {
  GameServiceError,
  createGame,
  getGame,
  joinGame,
  listGames,
  makeMove,
} from "../services/game-service";

export const gameRouter = Router();

type RouteHandler = (request: Request, response: Response) => void;

function getGameCode(request: Request): string {
  const code = request.params.code;

  if (typeof code !== "string" || code.length === 0) {
    throw new GameServiceError("Game code is required", 400);
  }

  return code;
}

function handleRoute(handler: RouteHandler): RouteHandler {
  return (request, response) => {
    try {
      handler(request, response);
    } catch (error) {
      if (error instanceof GameServiceError) {
        response.status(error.statusCode).json({ error: error.message });
        return;
      }

      console.error(error);
      response.status(500).json({ error: "Internal server error" });
    }
  };
}

gameRouter.post(
  "/",
  handleRoute((_request, response) => {
    const game = createGame();
    response.status(201).json({ code: game.code, player: "X", game });
  }),
);

gameRouter.get(
  "/",
  handleRoute((_request, response) => {
    response.json({ games: listGames() });
  }),
);

gameRouter.get(
  "/:code",
  handleRoute((request, response) => {
    response.json({ game: getGame(getGameCode(request)) });
  }),
);

gameRouter.post(
  "/:code/join",
  handleRoute((request, response) => {
    response.json(joinGame(getGameCode(request)));
  }),
);

gameRouter.post(
  "/:code/moves",
  handleRoute((request, response) => {
    const player = request.body?.player;
    const position = request.body?.position;

    if (
      (player !== "X" && player !== "O") ||
      typeof position !== "number" ||
      !Number.isInteger(position)
    ) {
      response.status(400).json({
        error: "Player must be X or O and position must be an integer",
      });
      return;
    }

    response.json({ game: makeMove(getGameCode(request), player, position) });
  }),
);
