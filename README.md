<p align="center">
  <img alt="FlumeTV Logo" src="https://raw.githubusercontent.com/TonyCJ7/FlumeTV-UI/main/public/assets/flumeMix.png" style="width: 100%; max-width: 500px; height: auto; background: none;">
</p>

<h1 align="center">FlumeTV UI</h1>

<p align="center">
  <strong>Official management panel for the FlumeTV Stremio IPTV addon.</strong>
  <br />
  Register, link Direct M3U and Xtream sources, monitor live sync status, stream prefetch logs, and install the Stremio addon — paired with the <a href="https://github.com/TonyCJ7/FlumeTV-API">FlumeTV API</a> backend.
</p>

<p align="center">
  <a href="https://github.com/TonyCJ7/FlumeTV-UI">
    <img src="https://img.shields.io/github/stars/TonyCJ7/FlumeTV-UI?style=for-the-badge&logo=github" alt="GitHub Stars">
  </a>
  <a href="https://github.com/TonyCJ7/FlumeTV-API">
    <img src="https://img.shields.io/badge/FlumeTV--API-backend-0ea5e9?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="FlumeTV API">
  </a>
  <a href="https://hub.docker.com/r/tonycj7/flumetv-ui">
    <img src="https://img.shields.io/badge/Docker%20Hub-flumetv--ui-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Hub">
  </a>
  <a href="https://github.com/TonyCJ7/FlumeTV-UI/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="License MIT">
  </a>
</p>

<p align="center">
  <a href="https://ko-fi.com/tonycj07" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Ko--fi-Support%20on%20Ko--fi-ff5e5b?style=for-the-badge&logo=ko-fi&logoColor=white" alt="Support on Ko-fi">
  </a>
</p>

---

## Table of contents

- [What is FlumeTV UI?](#-what-is-flumetv-ui)
- [Key features](#-key-features)
- [Getting started (full stack)](#-getting-started-full-stack)
- [Docker images](#-docker-images)
- [UI-only Docker](#-ui-only-docker)
- [Local development](#-local-development)
- [Environment variables](#-environment-variables)
- [Routes](#-routes)
- [Scripts](#-scripts)
- [Further reading](#-further-reading)
- [Support the project](#-support-the-project)
- [License](#license)

---

## ✨ What is FlumeTV UI?

FlumeTV UI is the **official frontend** for **[FlumeTV](https://github.com/TonyCJ7/FlumeTV-API)** — a self-hostable **Stremio IPTV addon**. It talks to the sibling **[FlumeTV API](https://github.com/TonyCJ7/FlumeTV-API)** over REST and Server-Sent Events (SSE) using session cookies (`credentials: "include"`). By default the **UI** is at **port 7000** and the **API** at **port 7001**.

**Docker images:** [`tonycj7/flumetv-ui:latest`](https://hub.docker.com/r/tonycj7/flumetv-ui) (~190 MB, fast, default) and [`tonycj7/flumetv-ui:configurable`](https://hub.docker.com/r/tonycj7/flumetv-ui) (~1.1 GB, full env overrides) on Docker Hub.

> [!IMPORTANT]
> **FlumeTV is a two-service stack.** This UI does not run standalone — you need the API (and PostgreSQL) running alongside it. Backend setup, REST routes, Stremio addon behavior, and the full server env catalog are documented in the **[FlumeTV API README](https://github.com/TonyCJ7/FlumeTV-API/blob/main/README.md)**.

---

## 🚀 Key features

Running **FlumeTV API + UI** together gives you a self-hosted Stremio IPTV stack you fully control:

### 📺 Stremio IPTV from your own server

- **Personal Stremio addon** — Serve live TV, movies, and series from your synced catalogs inside Stremio, with a private addon URL tied to your account.
- **One-click install** — Copy your manifest link or open Stremio Web with the addon pre-filled — no manual JSON editing.
- **Install while sync runs** — No need to wait for an import to finish. Add a source, install the addon in Stremio, and media appears as each sync completes in the background.
- **Configure from Stremio** — Opening configure in Stremio sends you straight into the management panel to manage sources for that account.

### 📡 Bring your own providers

- **Direct M3U playlists** — Point at an M3U URL (optional XMLTV EPG) and import channels into your catalog.
- **Xtream Codes panels** — Sync live, VOD, and series from a panel; playback URLs are resolved when you watch in Stremio.
- **Multiple named sources** — Link several providers under labels you choose; identical provider payloads share one catalog efficiently.
- **Enable or pause sources** — Turn individual sources on or off so only active ones appear in Stremio.

### ⚙️ Catalog sync you can see and control

- **Automatic background sync** — New and updated sources are imported on a schedule without manual intervention.
- **Manual refetch** — Trigger a fresh sync whenever you want updated channels or VOD.
- **Cancel in-flight jobs** — Stop a queued or running import if you added the wrong source or need to free the queue.
- **Live progress** — Watch sync status and completion in the panel as imports run, not just after they finish.
- **Detailed sync logs** — Inspect per-source import logs when you need to diagnose slow or failed syncs.

### 🛡️ Self-hosted and account-scoped

- **Your data, your Postgres** — Catalogs and credentials stay on infrastructure you run; nothing is sent to a hosted SaaS.
- **Per-user accounts** — Register separate logins so each household member can manage their own sources and Stremio addon URL.
- **Password management** — Change your account password from the panel without touching config files.

---

## 🚀 Getting started (full stack)

The fastest way to self-host **PostgreSQL + API + UI** is a single **Docker Compose** stack using the published images **[`tonycj7/flumetv-api:latest`](https://hub.docker.com/r/tonycj7/flumetv-api)** and **[`tonycj7/flumetv-ui:latest`](https://hub.docker.com/r/tonycj7/flumetv-ui)**.

### 1. Create a directory and `.env`

```bash
mkdir flumetv && cd flumetv
```

Create a `.env` file with at least:

```env
SESSION_JWT_SECRET=change_this_to_a_long_random_secret_for_sessions
ADDON_SECRET_KEY=change_this_to_a_long_random_secret_for_addon_tokens
```

Use long random strings for the two secrets. With default ports (**UI 7000**, **API 7001**), no other variables are required. Override **`FRONTEND_ORIGIN`** or port mappings only when users reach the stack at a non-default URL — see [Environment variables](#-environment-variables).

> [!NOTE]
> The default **`tonycj7/flumetv-ui:latest`** image bakes **`BASE_API_URL=http://localhost:7001`** at build time. That matches the compose setup above. If the browser must reach the API at a different origin, use the **[configurable image](#-docker-images)** instead.

### 2. Save `docker-compose.yml` and start

Save the compose file below as `docker-compose.yml`, then:

```bash
docker compose pull
docker compose up -d
```

| Service | URL |
| ------- | --- |
| **UI** | **http://localhost:7000** |
| **API** | **http://localhost:7001** |

First UI start is immediate with the default **`latest`** image (pre-built). PostgreSQL data persists in the **`postgres-data`** volume.

> [!TIP]
> For reverse proxies, set **`BASE_URL`** and **`TRUST_PROXY=1`** on the API side. See **[FlumeTV API — Environment variables](https://github.com/TonyCJ7/FlumeTV-API/blob/main/README.md#-environment-variables)**.

**Upgrade later:**

```bash
docker compose pull && docker compose up -d
```

### Compose file (copy-paste)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: flumetv-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: flumetv
      POSTGRES_PASSWORD: flumetv
      POSTGRES_DB: flumetv
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - flumetv-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U flumetv -d flumetv"]
      interval: 5s
      timeout: 5s
      retries: 5

  api:
    image: tonycj7/flumetv-api:latest
    container_name: flumetv-api
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - "7001:7001"
    env_file:
      - .env
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://flumetv:flumetv@postgres:5432/flumetv
    networks:
      - flumetv-network

  frontend:
    image: tonycj7/flumetv-ui:latest
    container_name: flumetv-ui
    restart: unless-stopped
    depends_on:
      - api
    ports:
      - "7000:7000"
    networks:
      - flumetv-network

volumes:
  postgres-data:

networks:
  flumetv-network:
    driver: bridge
```

> [!NOTE]
> To build the UI image locally instead of pulling from Docker Hub, replace the `frontend` service `image` line with `build: { context: ., dockerfile: Dockerfile }` and run `docker compose up -d --build`. Use **`Dockerfile.configurable`** and set **`BASE_API_URL`** in `.env` when the browser reaches the API at a non-default origin — see [Docker images](#-docker-images).

Backend-only compose (API + Postgres without UI) lives in the **[FlumeTV-API README](https://github.com/TonyCJ7/FlumeTV-API/blob/main/README.md#-getting-started)**.

---

## 🐳 Docker images

Two published image variants; each has a **floating** tag and a **version-pinned** tag (matches [`package.json`](package.json) `version`, currently **1.0.0**):

| Variant | Floating tag | Version-pinned tag | Size | Start time | Runtime env |
| ------- | ------------ | ------------------ | ---- | ---------- | ----------- |
| **Fast (default)** | `tonycj7/flumetv-ui:latest` | `tonycj7/flumetv-ui:1.0.0` | ~190 MB | Immediate | **`PORT`** only |
| **Configurable** | `tonycj7/flumetv-ui:configurable` | `tonycj7/flumetv-ui:1.0.0-configurable` | ~1.1 GB | ~30–60s (builds on start) | **`PORT`**, **`BASE_API_URL`** |

Pin a compose file to a release with e.g. `image: tonycj7/flumetv-ui:1.0.0`. Use **`latest`** / **`configurable`** to track the newest build of each variant.

**Fast (`latest`, `1.0.0`)** — multi-stage build with Next.js standalone output. **`BASE_API_URL` is always `http://localhost:7001`** (baked at image build time). Use this for the standard localhost stack or when API and UI share the default ports.

**Configurable (`configurable`, `1.0.0-configurable`)** — single-stage image with full `node_modules`. The container runs `npm run build && npm start` on each start, so you can change **`BASE_API_URL`** (and **`PORT`**) in `.env` and restart — no image rebuild.

### Compose: configurable image

Replace the `frontend` service `image` line:

```yaml
  frontend:
    image: tonycj7/flumetv-ui:configurable
    env_file:
      - .env
    environment:
      BASE_API_URL: https://api.example.com
```

---

## 🐳 UI-only Docker

When the API and Postgres already run elsewhere (for example via **[FlumeTV-API](https://github.com/TonyCJ7/FlumeTV-API)** compose):

```bash
git clone https://github.com/TonyCJ7/FlumeTV-UI.git
cd FlumeTV-UI

docker compose pull
docker compose up -d
```

No `.env` is required when the API is at **`http://localhost:7001`** (the default **`latest`** image). Copy [`.env.example`](.env.example) to `.env` only to override **`PORT`**.

> [!NOTE]
> The default **`latest`** image cannot override **`BASE_API_URL`** at runtime — it is always **`http://localhost:7001`**. Use **`tonycj7/flumetv-ui:configurable`** when the browser reaches the API at a different origin; see [Docker images](#-docker-images).

App: **http://localhost:7000**. Ensure the API sets **`FRONTEND_ORIGIN`** to match how users open this UI when not using the default **`http://localhost:7000`**.

---

## 💻 Local development

Requires Node.js ≥ 20.9. Run the API separately (see **[FlumeTV-API README](https://github.com/TonyCJ7/FlumeTV-API/blob/main/README.md#-getting-started)**).

```bash
git clone https://github.com/TonyCJ7/FlumeTV-UI.git
cd FlumeTV-UI
echo 'BASE_API_URL=http://localhost:7001' > .env.local

npm install
npm run dev
```

App: **http://localhost:7000**. Change **`BASE_API_URL`** in `.env.local` when the API is not at **`http://localhost:7001`**.

---

## 🔑 Environment variables

Docker defaults for the **[API image](https://hub.docker.com/r/tonycj7/flumetv-api)** are `PORT` **7001** and `FRONTEND_ORIGIN` **`http://localhost:7000`**. UI behavior depends on which image you run — see [Docker images](#-docker-images).

| UI image | `PORT` | `BASE_API_URL` |
| -------- | ------ | -------------- |
| **`latest`** (fast, default) | Override at runtime (default **7000**) | Fixed **`http://localhost:7001`** |
| **`configurable`** | Override at runtime (default **7000**) | Override via `.env` + container restart |

### Full stack (minimum)

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `SESSION_JWT_SECRET` | Yes | Signs REST session JWT |
| `ADDON_SECRET_KEY` | Yes | Encrypts Stremio addon tokens and panel passwords |

For the **full list** of environment variables (HTTP, CORS, prefetch tuning, proxies, and more), see **[FlumeTV-API README — Environment variables](https://github.com/TonyCJ7/FlumeTV-API/blob/main/README.md#-environment-variables)**.

### UI overrides (optional)

| Variable | Default | `latest` image | `configurable` image |
| -------- | ------- | -------------- | -------------------- |
| `PORT` | `7000` | Set when UI listens on a different port | Same |
| `BASE_API_URL` | `http://localhost:7001` | **Fixed** — cannot change at runtime | Set when browser reaches API at a different origin; change `.env` and **restart** |
| `DEBUG_MODE` | off | Reserved | Reserved |

On the **`configurable`** image, `BASE_API_URL` is inlined during the container’s `npm run build`. Change `.env` and **restart** the UI container to apply a new value.

### API overrides the UI cares about

Full backend catalog: **[FlumeTV-API README — Environment variables](https://github.com/TonyCJ7/FlumeTV-API/blob/main/README.md#-environment-variables)**.

| Variable | Default | Set when |
| -------- | ------- | -------- |
| `FRONTEND_ORIGIN` | `http://localhost:7000` | Users open the UI at a different browser URL (CORS + session cookies) |
| `BASE_URL` / `TRUST_PROXY` | off | UI and API sit behind a reverse proxy |

---

## 🗺️ Routes

| Route | Purpose |
| ----- | ------- |
| `/` | Redirects after session bootstrap → `/config` (signed in) or `/install` (guest) |
| `/install` | Account ID, change password, Stremio manifest copy / install |
| `/config` | Source list, add/edit/delete, refetch/cancel, prefetch bands, log dialog |

Auth is a **modal** (not a route). Cold visits show login/create-account over a disabled shell.

---

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Dev server (port 7000) |
| `npm run build` | Production build |
| `npm start` | Production server (`server.js`; `PORT` env) |
| `npm run lint` | ESLint |
| `npm run format` / `format:check` | Prettier |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run knip` | Unused export scan |

**Verify:** `npm run format:check && npm run lint && npm run typecheck && npm run build`

---

## Further reading

| Doc | Purpose |
| --- | ------- |
| [FlumeTV-API README](https://github.com/TonyCJ7/FlumeTV-API/blob/main/README.md) | Backend self-host, REST API, Stremio addon, full env catalog |
| [docs/frontend-reference.md](docs/frontend-reference.md) | UI architecture, Redux/SSE wiring, product behavior |
| [AGENTS.md](AGENTS.md) | Agent workflow and repo conventions |

---

## ❤️ Support the project

FlumeTV is developed and maintained for self-hosters. If you find it useful, please consider:

- ⭐ **[Star the repository](https://github.com/TonyCJ7/FlumeTV-UI)** on GitHub.
- 🤝 **Contribute** — Report issues, suggest features, or submit pull requests.
- ☕ **Donate**:

<p align="center">
  <a href="https://ko-fi.com/tonycj07" target="_blank" rel="noopener noreferrer">
    <img src="https://raw.githubusercontent.com/TonyCJ7/FlumeTV-UI/main/public/assets/kofi-logomark.png" alt="Ko-fi" height="40" />
  </a>
</p>

---

## License

MIT
