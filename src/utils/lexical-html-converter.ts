import { $createParagraphNode, $createTextNode, $getRoot, $isElementNode, LexicalNode } from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';

/**
 * Converts HTML string to Lexical editor state JSON string
 * @param html - HTML string to convert
 * @returns JSON string representation of Lexical editor state
 */
export function htmlToLexical(html: string): string {
  try {
    // Return empty editor state if no HTML provided
    if (!html) {
      return JSON.stringify({
        root: {
          children: [{
            children: [{
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: '',
              type: 'text',
              version: 1,
            }],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
          }],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        }
      });
    }

    // Check if we're in a server environment
    if (typeof window === 'undefined') {
      // Return a basic structure for SSR
      return JSON.stringify({
        root: {
          children: [{
            children: [{
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: html,
              type: 'text',
              version: 1,
            }],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
          }],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        }
      });
    }

    // Client-side conversion
    // Create a temporary DOM element to parse the HTML
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, 'text/html');
    
    // Import required Lexical modules dynamically
    // This is necessary because these imports would fail during SSR
    const { createEditor } = require('lexical');
    
    // Create a proper editor instance for the conversion
    const editor = createEditor({
      namespace: 'htmlToLexical',
      onError: () => {}
    });
    
    // Generate nodes from the DOM
    const nodes = $generateNodesFromDOM(editor, dom);

    // Convert nodes to a serializable format
    const serializedNodes: Array<Record<string, any>> = [];
    nodes.forEach(node => {
      if (node && typeof node.exportJSON === 'function') {
        serializedNodes.push(node.exportJSON());
      }
    });
    
    const state = {
      root: {
        children: serializedNodes,
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    };

    return JSON.stringify(state);
  } catch (error) {
    console.error('Error converting HTML to Lexical:', error);
    // Return empty editor state
    return JSON.stringify({
      root: {
        children: [
          {
            children: [],
            direction: null,
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    });
  }
}

/**
 * Converts Lexical editor state JSON string to HTML
 * @param lexicalState - JSON string representation of Lexical editor state
 * @returns HTML string
 */
export function lexicalToHtml(lexicalState: string): string {
  try {
    // For client-side only
    if (typeof window === 'undefined') {
      console.warn('lexicalToHtml called on server side, returning empty HTML');
      return '';
    }

    // Parse the JSON state
    const parsedState = JSON.parse(lexicalState);

    // Create a temporary DOM element
    const div = document.createElement('div');

    // Generate HTML from the parsed state
    // Note: This is a simplified version and may need to be expanded
    // based on your specific needs
    const html = generateHtmlFromState(parsedState);
    div.innerHTML = html;

    return div.innerHTML;
  } catch (error) {
    console.error('Error converting Lexical to HTML:', error);
    return '';
  }
}

/**
 * Helper function to generate HTML from a Lexical state object
 * @param state - Parsed Lexical state object
 * @returns HTML string
 */
function generateHtmlFromState(state: any): string {
  try {
    // This is a simplified implementation
    // In a real-world scenario, you would use $generateHtmlFromNodes
    // with a proper editor instance
    
    // For now, we'll do a basic conversion of common elements
    let html = '';
    
    if (state.root && Array.isArray(state.root.children)) {
      html = processNodes(state.root.children);
    }
    
    return html;
  } catch (error) {
    console.error('Error in generateHtmlFromState:', error);
    return '';
  }
}

/**
 * Process an array of Lexical nodes and convert to HTML
 * @param nodes - Array of Lexical node objects
 * @returns HTML string
 */
function processNodes(nodes: any[]): string {
  return nodes.map(node => {
    switch (node.type) {
      case 'paragraph':
        return `<p>${node.children ? processNodes(node.children) : ''}</p>`;
      case 'text':
        let text = node.text || '';
        if (node.format & 1) text = `<strong>${text}</strong>`; // Bold
        if (node.format & 2) text = `<em>${text}</em>`; // Italic
        if (node.format & 4) text = `<u>${text}</u>`; // Underline
        return text;
      case 'list':
        const listType = node.listType === 'number' ? 'ol' : 'ul';
        return `<${listType}>${node.children ? processNodes(node.children) : ''}</${listType}>`;
      case 'listitem':
        return `<li>${node.children ? processNodes(node.children) : ''}</li>`;
      case 'link':
        return `<a href="${node.url}">${node.children ? processNodes(node.children) : ''}</a>`;
      case 'table':
        return `<table>${node.children ? processNodes(node.children) : ''}</table>`;
      case 'tablerow':
        return `<tr>${node.children ? processNodes(node.children) : ''}</tr>`;
      case 'tablecell':
        const cellTag = node.header ? 'th' : 'td';
        return `<${cellTag}>${node.children ? processNodes(node.children) : ''}</${cellTag}>`;
      default:
        return node.children ? processNodes(node.children) : '';
    }
  }).join('');
}