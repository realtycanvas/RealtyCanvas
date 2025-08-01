import { useState, useEffect } from 'react';
import { registerQuillModules } from '@/utils/quill-modules';

/**
 * Custom hook for initializing ReactQuill editor
 * @param initialValue - Initial content for the editor
 * @returns Object containing editor state and handlers
 */
export const useQuillEditor = (initialValue: string = '') => {
  // State for editor content
  const [content, setContent] = useState<string>(initialValue);
  // State to track if editor is ready
  const [isEditorReady, setIsEditorReady] = useState<boolean>(false);

  // Register Quill modules when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Register Quill modules
      registerQuillModules()
        .then(() => {
          setIsEditorReady(true);
        })
        .catch((error) => {
          console.error('Error initializing Quill editor:', error);
        });
    }
  }, []);

  // Handler for content changes
  const handleContentChange = (value: string) => {
    setContent(value);
  };

  // Return editor state and handlers
  return {
    content,
    setContent,
    handleContentChange,
    isEditorReady,
  };
};