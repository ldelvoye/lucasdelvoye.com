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

npm workspaces. The site lives in `apps/web` (Next.js, App Router). There is
one page, `app/page.tsx`, which renders every tab on the server and hands them
to the client shell. Tab content is in `apps/web/content/`.

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
