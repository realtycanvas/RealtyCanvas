# Vedic City Goa — React implementation (shelved)

The Next.js/React rebuild of `/vedic-city-goa`. Shelved because that URL now serves
the original static build verbatim (it carries its own GTM container and Pabbly
webhook wiring, which we did not want to re-implement).

Nothing in this folder is compiled or routed: `archive` is excluded in
`tsconfig.json` and ignored in `eslint.config.mjs`.

## What is here

| path              | came from                             |
| ----------------- | ------------------------------------- |
| `route/page.tsx`  | `app/(routes)/vedic-city-goa/page.tsx` |
| `components/`     | `components/vedic-city-goa/`           |
| `public-assets/`  | `public/vedic-city-goa/` (WebP set converted from the PHP images, plus the hero video) |

## To restore

1. Move the static build out of the way — it currently occupies the same public path:
   `public/vedic-city-goa/` → somewhere else, or delete it.
2. `archive/vedic-city-goa-react/public-assets/` → `public/vedic-city-goa/`
3. `archive/vedic-city-goa-react/components/` → `components/vedic-city-goa/`
4. `archive/vedic-city-goa-react/route/page.tsx` → `app/(routes)/vedic-city-goa/page.tsx`
5. Remove the `/vedic-city-goa` rewrite from `next.config.ts`.

Still wired up elsewhere and correct for either version, so leave alone:

- `components/layout/site-chrome.tsx` — suppresses the global navbar/footer on this
  route (only has an effect when the React page is live).
- `app/sitemap.ts` and `lib/llms.ts` — both reference the `/vedic-city-goa` URL,
  which is valid regardless of which implementation serves it.
