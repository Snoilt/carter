# Repository Guidelines

## Project Structure & Module Organization
- `app/` Nuxt 4 client: pages, components, composables, middleware, assets.
- `database/` Go service extending PocketBase (custom routes).
- `pocketbase/` binary + `pb_hooks/` and `pb_migrations/`.
- `public/` static assets; `nuxt.config.ts`, `eslint.config.mjs`, `tsconfig.json` at root.

## Build, Test, and Development Commands
- Install deps: `bun install` (preferred) or `npm install`.
- Frontend dev: `bun run dev` — start Nuxt at localhost.
- Frontend build: `bun run build` / preview: `bun run preview`.
- Lint: `bun run lint` (ESLint) — Format: `bun run format` (Prettier).
- PocketBase local typegen: `bun run pb:local:typegen` (prompts for email/password; writes `app/types/pb.d.ts`).
- PocketBase server: `./pocketbase/pocketbase serve` (apply `pb_migrations` and load hooks).
- Go service (optional standalone): `cd database && go run .`.

## Coding Style & Naming Conventions
- TypeScript, Vue SFCs, 2‑space indent. Run Prettier before committing.
- ESLint with Nuxt + `eslint-plugin-unicorn`; keep rules green.
- Components/files: kebab-case filenames (e.g., `card/editor.vue`), PascalCase in templates.
- Composables: `app/composables/` with `use-` prefix (e.g., `use-user.ts`).
- Pages use directory routing under `app/pages/` (e.g., `app/pages/room/[room]/index.vue`).

## Testing Guidelines
- No formal suite yet. If adding tests:
  - Frontend: `*.spec.ts` near source or under `app/**/__tests__/`; run with Vitest.
  - Go: `*_test.go`; run `go test ./...`.
  - Aim for coverage on routes, composables, and critical UI states.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:` (present tense, imperative).
- PRs include: clear description, linked issues, screenshots for UI, test notes, and migration notes (if touching PocketBase).

## Security & Configuration Tips
- Do not commit secrets. Store PocketBase creds locally; use `.env` for Nuxt runtime config if needed.
- Migrations live in `pocketbase/pb_migrations/`; hooks in `pocketbase/pb_hooks/`. Validate on a local DB before PR.

## Agent-Specific Instructions
- Keep changes minimal and aligned with existing structure. Prefer `rg` for code search. Avoid broad refactors without discussion.



## MCP Servers

  - Purpose: give agents read/ops on this repository via MCP tools.
  - Prereqs: Node 18+ and either Bun (bunx) or npm (npx).
  - Security: scope filesystem servers to the repo root; avoid exposing $HOME.

  Recommended servers

  - Filesystem (repo browsing, read/write)
      - Run (npm): npx -y @modelcontextprotocol/server-filesystem --root .
      - Run (bun): bunx @modelcontextprotocol/server-filesystem --root .
  - Git (log, diff, blame)
      - Run (npm): npx -y @modelcontextprotocol/server-git --repo .
      - Run (bun): bunx @modelcontextprotocol/server-git --repo .

  Client configuration example

  - Many MCP clients accept a JSON config that they use to launch servers:
{
  "mcpServers": {
    "nuxt": {
      "command": "bunx",
      "args": [
        "mcp-remote",
        "https://nuxt.com/mcp"
      ]
    }
  }
}

  Notes

  - Replace npx with bunx if you prefer Bun.
  - Keep servers’ working directory at the repo root.
  - Add more servers as needed (e.g., OpenAPI, Postgres) using the same pattern.