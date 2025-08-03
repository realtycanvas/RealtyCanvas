/**
 * Utility function to strip HTML tags from a string
 * @param html - HTML string to strip tags from
 * @returns Plain text without HTML tags
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  
  // Check if we're in a server environment
  if (typeof window === 'undefined') {
    // Simple regex-based HTML stripping for server-side
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&amp;/g, '&') // Replace ampersands
      .replace(/&lt;/g, '<') // Replace less than
      .replace(/&gt;/g, '>') // Replace greater than
      .trim();
  }
  
  // Client-side HTML stripping using DOM
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}