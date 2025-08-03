import { useState, useEffect } from 'react';
import { EditorState } from 'lexical';
import { htmlToLexical, lexicalToHtml } from '@/utils/lexical-html-converter';

/**
 * Custom hook for managing a Lexical editor
 * @param initialValue - Initial HTML content for the editor
 * @returns Object containing editor state and methods
 */
export function useLexicalEditor(initialValue: string = '') {
  // State for tracking editor content as HTML
  const [content, setContent] = useState<string>(initialValue);
  // State for tracking if editor is ready
  const [isReady, setIsReady] = useState<boolean>(false);
  // State for storing the initial editor value in Lexical format
  const [editorValue, setEditorValue] = useState<string | null>(null);

  // Initialize editor with default content if provided
  useEffect(() => {
    console.log('Initializing Lexical editor...');
    
    if (initialValue) {
      try {
        // Convert HTML to Lexical state
        const lexicalState = htmlToLexical(initialValue);
        setEditorValue(lexicalState);
      } catch (error) {
        console.error('Error initializing Lexical editor with HTML:', error);
        // Set empty editor state if conversion fails
        setEditorValue(null);
      }
    }
    
    // Set editor as ready after a short delay to ensure initialization
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [initialValue]);

  // Handler for content changes
  const handleEditorChange = (editorState: EditorState) => {
    editorState.read(() => {
      // Serialize the editor state to JSON
      const json = JSON.stringify(editorState.toJSON());
      // Convert the JSON to HTML
      const htmlString = lexicalToHtml(json);
      // Update the content state
      setContent(htmlString);
    });
  };

  // Default editor configuration
  const editorConfig = {
    namespace: 'LexicalEditor',
    theme: {
      // Theme classes will be defined in CSS
      paragraph: 'editor-paragraph',
      text: {
        bold: 'editor-text-bold',
        italic: 'editor-text-italic',
        underline: 'editor-text-underline',
      },
      // Add more theme classes as needed
    },
    onError: (error: Error) => {
      console.error('Lexical Editor Error:', error);
    },
  };

  return {
    content,
    isReady,
    editorValue,
    editorConfig,
    handleChange: handleEditorChange,
  };
}