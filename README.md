## 

## Docker & Compose

A Dockerfile is provided to build the Go service and statically generate the Nuxt app. You can run the service with Docker Compose.

Compose file (compose.yaml):

```yaml
name: carter
services:
  pocketbase:
    image: ghcr.io/snoilt/carter:latest
    ports:
      - 8080:8080
    volumes:
      - ./pb_data:/app/pb_data
```

Start with Compose (pulls the prebuilt image):
```bash
docker compose up -d
```
- Service available at http://localhost:8080
- Data persists in `./pb_data`

Optional: build and run the image locally
```bash
docker build -t carter:local .
docker run --rm -p 8080:8080 -v "$(pwd)/pb_data:/app/pb_data" carter:local
```

## Contribute

#### Prerequisites

- Node.js 22+
- Bun installed: https://bun.sh/ (macOS/Linux via `curl -fsSL https://bun.sh/install | bash` or Homebrew: `brew install oven-sh/bun/bun`)
- Go 1.21+ 

## Quick Start

1) Install dependencies (frontend):
```bash
bun install
```

2) Start the Nuxt dev server (http://localhost:3000):
```bash
bun run dev
```

3) Start the database/backend (PocketBase Go service in dev mode):
```bash
cd database
go run main.go serve --dev
```

Notes:
- Frontend and backend run separately. The Go backend embeds PocketBase and loads custom routes and migrations.
- Dev mode is convenient for local work (auto‑migrate is enabled when running via `go run`).

## Generate PocketBase Types

For type‑safe frontend code you can generate PocketBase types locally. Ensure your PocketBase server is reachable (default http://localhost:8090), then run:

```bash
bun run pb:local:typegen
```

The script prompts for admin email and password and writes the generated types to `app/types/pb.d.ts`.
