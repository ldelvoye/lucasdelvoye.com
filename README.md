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
