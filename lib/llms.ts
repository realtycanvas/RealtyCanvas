// Generators for /llms.txt and /llms-full.txt (see https://llmstxt.org).
// buildLlmsTxt()      -> a concise markdown index of the site.
// buildLlmsFullTxt()  -> the same structure with full article content inlined.
//
// Data sources for THIS project:
//   - Projects (the "products"): Prisma / Postgres
//   - Insights (blog): Sanity (Portable Text)
// All remote fetches are wrapped so a transient DB/CMS outage degrades to the
// static sections instead of throwing (this also keeps the Vercel build green
// when the production database isn't reachable from the build network).

import type { PortableTextBlock } from '@portabletext/types';
import { prisma } from '@/lib/prisma';
import { getAllBlogPostsForLlms } from '@/lib/sanity/queries';
import type { BlogPost } from '@/lib/sanity/types';
import { siteConfig } from '@/lib/site-config';

const { siteUrl, siteName } = siteConfig;

// ─────────────────────────────────────────────
// Static page map
// ─────────────────────────────────────────────
const KEY_PAGES: { label: string; path: string; desc: string }[] = [
  { label: 'Home', path: '/', desc: 'Overview of Realty Canvas and featured Gurgaon properties.' },
  { label: 'Projects', path: '/projects', desc: 'Browse all verified residential and commercial projects.' },
  {
    label: 'Residential Plots in Gurgaon',
    path: '/residential-plots-in-gurgaon',
    desc: 'Curated residential plot listings and buyer guidance in Gurgaon.',
  },
  {
    label: 'Vedic City Goa',
    path: '/vedic-city-goa',
    desc: 'Anandam villa plots in North Goa - 46-acre development, 240-300 sq. yd. plots, ₹58 Lakh onwards, 20 mins from MOPA Airport.',
  },
  { label: 'Insights (Blog)', path: '/blog', desc: 'Market analysis, investment tips and property guides.' },
  { label: 'About', path: '/about', desc: 'Who Realty Canvas is and how we work.' },
  { label: 'Contact', path: '/contact', desc: 'Get in touch for enquiries and site visits.' },
];

const LEGAL_PAGES: { label: string; path: string }[] = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms of Service', path: '/terms-of-service' },
  { label: 'Cookie Policy', path: '/cookie-policy' },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function absUrl(path: string): string {
  if (!path || path === '/') return siteUrl;
  return `${siteUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}

// Strip a trailing " | Brand" suffix for nicer labels.
function cleanTitle(title?: string | null): string {
  if (!title) return '';
  return title.split(' | ')[0].trim();
}

function truncate(text: string, max = 180): string {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

function formatDate(value?: string): string {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

// ─────────────────────────────────────────────
// Portable Text → markdown (text-only; images/embeds skipped)
// ─────────────────────────────────────────────
interface PTSpan {
  _type: string;
  text?: string;
  marks?: string[];
}
interface PTMarkDef {
  _key: string;
  _type: string;
  href?: string;
}

function serializeSpans(children: PTSpan[] = [], markDefs: PTMarkDef[] = []): string {
  return children
    .map((child) => {
      if (child._type !== 'span' || !child.text) return '';
      let text = child.text;
      const marks = child.marks ?? [];

      if (marks.includes('code')) text = `\`${text}\``;
      if (marks.includes('strong')) text = `**${text}**`;
      if (marks.includes('em')) text = `*${text}*`;

      // Link annotations live in markDefs and are referenced by _key in marks.
      const link = markDefs.find((d) => marks.includes(d._key) && (d._type === 'link' || Boolean(d.href)));
      if (link?.href) text = `[${text}](${link.href})`;

      return text;
    })
    .join('');
}

// headingOffset demotes body headings so they nest under the article title.
function serializePortableText(blocks: PortableTextBlock[] = [], headingOffset = 2): string {
  const out: string[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i] as unknown as {
      _type: string;
      style?: string;
      listItem?: string;
      level?: number;
      children?: PTSpan[];
      markDefs?: PTMarkDef[];
    };

    // Skip non-text blocks (images, code blocks, embeds, …).
    if (!block || block._type !== 'block') {
      i++;
      continue;
    }

    // Collapse consecutive list items into one markdown list.
    if (block.listItem) {
      const items: string[] = [];
      while (i < blocks.length) {
        const b = blocks[i] as unknown as {
          _type: string;
          listItem?: string;
          level?: number;
          children?: PTSpan[];
          markDefs?: PTMarkDef[];
        };
        if (b._type !== 'block' || !b.listItem) break;
        const indent = '  '.repeat(Math.max(0, (b.level ?? 1) - 1));
        const marker = b.listItem === 'number' ? '1.' : '-';
        const text = serializeSpans(b.children, b.markDefs);
        if (text.trim()) items.push(`${indent}${marker} ${text}`);
        i++;
      }
      if (items.length) out.push(items.join('\n'));
      continue;
    }

    const text = serializeSpans(block.children, block.markDefs);
    const style = block.style ?? 'normal';

    if (/^h[1-6]$/.test(style)) {
      const level = Math.min(6, parseInt(style.slice(1), 10) + headingOffset);
      if (text.trim()) out.push(`${'#'.repeat(level)} ${text}`);
    } else if (style === 'blockquote') {
      if (text.trim())
        out.push(
          text
            .split('\n')
            .map((l) => `> ${l}`)
            .join('\n')
        );
    } else if (text.trim()) {
      out.push(text);
    }

    i++;
  }

  return out.join('\n\n');
}

// ─────────────────────────────────────────────
// Data loaders (resilient)
// ─────────────────────────────────────────────
interface ProjectForLlms {
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  city: string | null;
  locality: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

async function getProjects(): Promise<ProjectForLlms[]> {
  try {
    return await prisma.project.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: {
        slug: true,
        title: true,
        subtitle: true,
        description: true,
        city: true,
        locality: true,
        seoTitle: true,
        seoDescription: true,
      },
    });
  } catch (error) {
    console.error('[llms] failed to load projects:', error);
    return [];
  }
}

async function getPosts(): Promise<BlogPost[]> {
  try {
    return await getAllBlogPostsForLlms();
  } catch (error) {
    console.error('[llms] failed to load blog posts:', error);
    return [];
  }
}

function projectSummary(p: ProjectForLlms): string {
  return truncate(p.seoDescription || p.subtitle || p.description || '');
}

// ─────────────────────────────────────────────
// Generators
// ─────────────────────────────────────────────
export async function buildLlmsTxt(): Promise<string> {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);

  const lines: string[] = [`# ${siteName}`, '', `> ${siteConfig.description}`, ''];

  lines.push('## Key Pages');
  for (const page of KEY_PAGES) lines.push(`- [${page.label}](${absUrl(page.path)}): ${page.desc}`);
  lines.push('');

  if (projects.length) {
    lines.push('## Projects');
    for (const p of projects) {
      const label = cleanTitle(p.seoTitle || p.title);
      const summary = projectSummary(p);
      lines.push(`- [${label}](${absUrl(`/projects/${p.slug}`)})${summary ? `: ${summary}` : ''}`);
    }
    lines.push('');
  }

  if (posts.length) {
    lines.push('## Insights (Blog)');
    for (const post of posts) {
      const label = cleanTitle(post.seo?.metaTitle || post.title);
      const excerpt = post.excerpt ? truncate(post.excerpt) : '';
      lines.push(`- [${label}](${absUrl(`/blog/${post.slug.current}`)})${excerpt ? `: ${excerpt}` : ''}`);
    }
    lines.push('');
  }

  lines.push('## Legal');
  for (const page of LEGAL_PAGES) lines.push(`- [${page.label}](${absUrl(page.path)})`);
  lines.push('');

  return lines.join('\n');
}

export async function buildLlmsFullTxt(): Promise<string> {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);

  const lines: string[] = [`# ${siteName}`, '', `> ${siteConfig.description}`, ''];

  lines.push('## Key Pages');
  for (const page of KEY_PAGES) lines.push(`- [${page.label}](${absUrl(page.path)}): ${page.desc}`);
  lines.push('');

  if (projects.length) {
    lines.push('## Projects', '');
    for (const p of projects) {
      lines.push(`### ${cleanTitle(p.seoTitle || p.title)}`);
      const meta: string[] = [];
      const location = [p.locality, p.city].filter(Boolean).join(', ');
      if (location) meta.push(`- Location: ${location}`);
      meta.push(`- URL: ${absUrl(`/projects/${p.slug}`)}`);
      lines.push(meta.join('\n'));
      if (p.subtitle) lines.push(`> ${p.subtitle}`);
      if (p.description) lines.push(p.description.trim());
      lines.push('');
    }
  }

  if (posts.length) {
    lines.push('## Insights (Blog)', '');
    for (const post of posts) {
      lines.push(`### ${cleanTitle(post.seo?.metaTitle || post.title)}`);

      const meta: string[] = [];
      const date = formatDate(post.publishedAt);
      if (date) meta.push(`- Date: ${date}`);
      if (post.author?.name) meta.push(`- Author: ${post.author.name}`);
      const categories = (post.categories ?? []).map((c) => c.title).filter(Boolean);
      if (categories.length) meta.push(`- Categories: ${categories.join(', ')}`);
      meta.push(`- URL: ${absUrl(`/blog/${post.slug.current}`)}`);
      lines.push(meta.join('\n'));

      if (post.excerpt) lines.push(`> ${post.excerpt}`);

      const body = serializePortableText(post.body, 2);
      if (body) lines.push(body);

      if (post.faqs?.length) {
        lines.push('#### FAQ');
        for (const faq of post.faqs) {
          lines.push(`**Q: ${faq.question}**`);
          lines.push(`A: ${faq.answer}`);
          lines.push('');
        }
      }

      lines.push('');
    }
  }

  lines.push('## Legal');
  for (const page of LEGAL_PAGES) lines.push(`- [${page.label}](${absUrl(page.path)})`);
  lines.push('');

  return lines.join('\n');
}
