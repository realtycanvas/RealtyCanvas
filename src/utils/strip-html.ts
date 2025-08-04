/**
 * Utility function to strip HTML tags from a string and return plain text
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  
  // Remove HTML tags
  const withoutTags = html.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  const textarea = document.createElement('textarea');
  textarea.innerHTML = withoutTags;
  const decoded = textarea.value;
  
  // Clean up extra whitespace
  return decoded.replace(/\s+/g, ' ').trim();
}

/**
 * Utility function to truncate text to a specific length
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (!text) return '';
  
  const stripped = stripHtml(text);
  
  if (stripped.length <= maxLength) {
    return stripped;
  }
  
  return stripped.substring(0, maxLength).trim() + '...';
}

/**
 * Check if a string contains HTML tags
 */
export function hasHtmlTags(str: string): boolean {
  if (!str) return false;
  // Simple regex to detect HTML tags
  return /<[^>]*>/g.test(str);
}

export function preserveRichText(html: string): string {
  // Check if we're in a browser environment
  if (typeof document === 'undefined') {
    // Server-side rendering - return the HTML as is
    return html;
  }
  
  // Preserve basic formatting like bold, italic, lists, and links
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Remove potentially dangerous elements while keeping formatting
  const allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'blockquote'];
  const elements = tempDiv.querySelectorAll('*');
  
  elements.forEach(el => {
    if (!allowedTags.includes(el.tagName.toLowerCase())) {
      // Replace with span to preserve content
      const span = document.createElement('span');
      span.innerHTML = el.innerHTML;
      el.parentNode?.replaceChild(span, el);
    }
  });
  
  return tempDiv.innerHTML;
}