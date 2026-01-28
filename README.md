# Humor

A minimal, single-author blog platform with a moody glassmorphism UI, Markdown posts, and a small SQLite-backed API.

## Features
- Owner-only publishing and site settings.
- Markdown rendering on the client (sanitized).
- SQLite storage for posts and site config.
- Optional inspiration feed (via the `bird` CLI when configured).

## Local development

1) Install dependencies
```bash
npm install
```

2) Copy environment files
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

3) Start the app
```bash
npm run dev
```

Client: `http://localhost:5173`  
Server: `http://localhost:3001`

## Configuration

Server `.env` options (see `server/.env.example`):
- `PORT`: API port (default `3001`)
- `DB_PATH`: SQLite file path (default `humor.db`)
- `SESSION_TTL_HOURS`: session expiration in hours (default `168`)
- `PASSWORD_ROUNDS`: bcrypt cost factor (default `12`)
- `CORS_ORIGIN`: comma-separated list of allowed origins
- `AUTH_TOKEN`, `CT0`: optional credentials for the `bird` CLI

Client `.env` options (see `client/.env.example`):
- `VITE_API_BASE_URL`: base URL for the API (default `http://localhost:3001`)

## Notes
- First-time setup happens in the UI (you become the owner).
- If the inspiration feed cannot reach `bird`, the server returns a safe local fallback.

## License

MIT. See `LICENSE`.
