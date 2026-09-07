# lucasdelvoye.com

Personal site. The page is a terminal window: it types `brew install smorg`,
pretends to install it, runs `smorg`, and opens a smorg-style dashboard with
one tab per topic. It only looks like [smorg](https://github.com/ldelvoye/smorg);
nothing here runs it.

## Develop

    npm install
    npm run dev

Then open http://localhost:3000. Any other path redirects to `/`.

    npm run lint
    npm run typecheck
    npm test
    npm run build

## Layout

npm workspaces. The site lives in `apps/web` (Next.js, App Router). There is one
page, `app/page.tsx`, a server component that renders `Site` with one `Pane` per
entry in `features/tabs.ts`. Every tab's panel is server-rendered into the HTML
and hidden until its tab is active, so switching tabs never touches the network.

- `components/` — the shell. `Site.tsx` is the phase machine (intro, expanding,
  full); `window/` is the terminal window that grows into the app; `shell/` is
  the tab strip, stage, player and footer, plus the key map and the context a
  tab's list registers into; `ui/` is the Box, Rows, KeyValue, CharBar and Tag
  primitives; `pixels/` is the converter that draws every image as half-block
  terminal pixel art.
- `features/` — one folder per tab. Adding a tab is one folder and one entry in
  `features/tabs.ts`; no shared file changes.
- `styles/` — `tokens.css` is the only place a colour, easing, duration or
  radius is written; `chrome.css` is the structural layout shared by the window
  and the shell.

## Deploy

Every Railway service in the project is declared in `.railway/railway.ts`,
one `service()` block per app under `apps/`. Each app owns its Dockerfile,
built with the repo root as context so npm workspaces resolve. Apply changes
to the infrastructure file with:

    railway config plan
    railway config apply

Pushes to `main` deploy the `web` service. The image runs Next's standalone
server on the port Railway injects. `www.lucasdelvoye.com` redirects to the
apex from `next.config.ts`.

Watch paths are not part of the infrastructure file, because Railway's DSL
has no field for them. They are set in the service's settings in the
dashboard (`apps/web/**`, `package.json`, `package-lock.json`,
`.dockerignore`), and `railway config apply` does not touch them.

To check the image locally:

    docker build -f apps/web/Dockerfile -t lucasdelvoye.com .
    docker run --rm -p 3000:3000 lucasdelvoye.com
