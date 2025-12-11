# Next.js SEO Guidelines for Reality Canvas

This document outlines the SEO best practices implemented in the Reality Canvas project and guides developers on maintaining and extending them.

## 1. Rendering Strategy (SSR vs CSR)

**Guideline:** Always prefer Server-Side Rendering (SSR) for pages that require indexing (Projects, Blogs).

- **Use Server Components** for `page.tsx` to fetch data.
- **Use Client Components** (e.g., `featureClient.tsx`) ONLY for interactivity (search, filters, clicks).
- **Pass Data**: Fetch data in the Server Component and pass it as props to the Client Component.

### Why?

Googlebot crawls the initial HTML. If data loads via `useEffect` (CSR), Google might see an empty page.

## 2. Metadata API

**Guideline:** Use Next.js Metadata API in every `layout.tsx` or `page.tsx`.

```typescript
export const metadata: Metadata = {
  title: 'Page Title | Reality Canvas',
  description: 'Page description...',
  alternates: { canonical: 'https://...' },
  openGraph: { ... },
}
```

- **Dynamic Metadata**: Use `generateMetadata` for dynamic pages (e.g., `[slug]/page.tsx`).
- **Canonical URLs**: Always define `alternates.canonical` to avoid duplicate content punishment.

## 3. Schema Markup (JSON-LD)

**Guideline:** Add structured data to help Google understand page content.

We use a custom `<JsonLd>` component.

### Implementation

```tsx
import JsonLd from "@/components/SEO/JsonLd";

const schema = {
  "@context": "https://schema.org",
  "@type": "Product", // or Article, RealEstateListing
  name: "...",
  // ...
};

return (
  <>
    <JsonLd data={schema} />
    {/* Page Content */}
  </>
);
```

**Common Schemas:**

- **Project Detail**: `RealEstateListing` or `Product`.
- **Blog Post**: `Article`.
- **Listing Pages**: `CollectionPage`.

## 4. Sitemap & Robots

- **Robots.ts**: Configured in `src/app/robots.ts`. Dynamically sets the sitemap URL.
- **Sitemap.ts**: `src/app/sitemap.xml/route.ts` dynamically fetches all Projects and Blogs.
  - **Action**: If you add a NEW dynamic section (e.g., `/developers`), update `sitemap.xml/route.ts` to include those URLs.

## 5. Image Optimization

**Guideline:** Always use descriptive `alt` text.

- **Bad**: `alt="image"`
- **Good**: `alt="3BHK Floor Plan for Elan Presidential"`

Use `next/image` or our `LazyImage` wrapper to ensure efficient loading.

## 6. Internal Linking

**Guideline:** Use `<Link href="...">` instead of `<a>`.

- Ensure buttons that navigate are wrapped in `<Link>`.
- Add links between related contents (e.g., Related Projects on a Blog post).
