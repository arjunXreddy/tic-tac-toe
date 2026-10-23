# Tic Tac Toe Backend

An Express API backed by a shared in-memory `Map`. Game data is lost when the server restarts.

## Setup

```bash
bun install
```

## Run

```bash
bun run dev
```

The server runs on `http://localhost:3000` by default. Set `PORT` to override it.

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Health check |
| `POST` | `/api/games` | Create a game and return its code |
| `GET` | `/api/games` | List games in memory |
| `GET` | `/api/games/:code` | Get a game |
| `POST` | `/api/games/:code/join` | Join a waiting game as `O` |
| `POST` | `/api/games/:code/moves` | Make a move |

Create a game:

```bash
curl -X POST http://localhost:3000/api/games
```

Join it:

```bash
curl -X POST http://localhost:3000/api/games/ABC123/join
```

Make a move using board positions `0` through `8`:

```bash
curl -X POST http://localhost:3000/api/games/ABC123/moves \
  -H "Content-Type: application/json" \
  -d '{"player":"X","position":4}'
```

## Layout

```text
src/
├── http/game-routes.ts
├── services/game-code.ts
├── services/game-logic.ts
├── services/game-service.ts
├── store/game-store.ts
├── types/game.ts
└── server.ts
```
