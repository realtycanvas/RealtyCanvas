import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

// Paths that should never be crawled (admin app, Sanity studio, API, create form).
const DISALLOW = ['/api/', '/admin/', '/studio/', '/projects/create'];

// AI crawlers/assistants explicitly welcomed with the same access as general bots.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Amazonbot',
  'Bytespider',
  'CCBot',
  'DuckAssistBot',
  'cohere-ai',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: DISALLOW },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    host: siteConfig.siteUrl,
  };
}
