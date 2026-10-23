import { createServer } from "node:http";
import express from "express";
import { gameRouter } from "./http/game-routes";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });
  app.use("/api/games", gameRouter);
  app.use((_request, response) => {
    response.status(404).json({ error: "Not found" });
  });

  return app;
}

export function startServer(port = Number(process.env.PORT ?? 3000)) {
  const server = createServer(createApp());

  server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });

  return server;
}
