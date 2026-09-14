# lucasdelvoye.com

Personal site. The page is a terminal window: it types `brew install smorg`, pretends to install it, runs `smorg`, and opens a smorg-style dashboard with one tab per topic. It only looks like [smorg](https://github.com/ldelvoye/smorg); nothing here runs it.

## Develop

    npm install
    npm run dev:api
    npm run dev

The first starts the backend on http://127.0.0.1:8788 and needs the Spotify and GitHub credentials in `apps/api/.env.local`; the second starts the site, which reads the backend's address from `API_ORIGIN` in `apps/web/.env.local`. Then open http://localhost:3000. Any other path redirects to `/`.

    npm run lint
    npm run typecheck
    npm test
    npm run build

## Layout

npm workspaces, two apps and one shared package.

`apps/api` is the backend: a Hono server that Node runs straight from its TypeScript source. It owns every call to Spotify and GitHub, the smorg version lookup, every cache, and the poller that records play history to the Railway bucket. `packages/contract` holds the response types and route paths both apps import, and nothing else.

`apps/web` is the site (Next.js, App Router). It renders and holds no state: each panel fetches what it needs from the backend during its own render. There is one page, `app/page.tsx`, a server component that renders `Site` with one `Pane` per entry in `features/tabs.ts`. Every tab's panel is server-rendered into the HTML and hidden until its tab is active, so switching tabs never touches the network.

- `components/` — the shell. `Site.tsx` is the phase machine (intro, expanding, full); `window/` is the terminal window that grows into the app; `shell/` is the tab strip, stage, player and footer, plus the key map and the context a tab's list registers into; `ui/` is the Box, Rows, KeyValue, CharBar and Tag primitives.
- `features/` — one folder per tab. Adding a tab is one folder and one entry in `features/tabs.ts`; no shared file changes.
- `styles/` — `tokens.css` is the only place a colour, easing, duration or radius is written; `chrome.css` is the structural layout shared by the window and the shell.

## Deploy

Every Railway service in the project is declared in `.railway/railway.ts`, one `service()` block per app under `apps/`. Each app owns its Dockerfile, built with the repo root as context so npm workspaces resolve. Apply changes to the infrastructure file with:

    railway config plan
    railway config apply

Pushes to `main` deploy both services; each one's watch patterns in the infrastructure file keep it from rebuilding for the other's changes. `web` runs Next's standalone server on the port Railway injects and reaches `api` over the private network through `API_ORIGIN`. `api` has no public domain and holds the only copies of the Spotify and GitHub credentials. The `history` bucket is declared in the same file. `www.lucasdelvoye.com` redirects to the apex from `next.config.ts`.

To check the images locally:

    docker build -f apps/web/Dockerfile -t lucasdelvoye.com .
    docker run --rm -p 3000:3000 lucasdelvoye.com
    docker build -f apps/api/Dockerfile -t lucasdelvoye.com-api .
    docker run --rm -e PORT=8080 -p 8080:8080 lucasdelvoye.com-api
