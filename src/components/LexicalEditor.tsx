'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { LinkNode } from '@lexical/link';
import { ListNode, ListItemNode } from '@lexical/list';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalEditor } from '@/hooks/useLexicalEditor';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import LexicalToolbar from './LexicalToolbar';

// Import styles
import '@/app/styles/lexical-editor.css';

// Define theme for the editor
const theme = {
  paragraph: 'editor-paragraph',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
  },
  // Add more theme classes as needed
};

interface LexicalEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

const LexicalEditor = ({
  initialValue = '',
  onChange,
  placeholder = 'Enter some text...',
  readOnly = false,
  className = '',
}: LexicalEditorProps) => {
  // Use our custom hook to manage editor state
  const { content, isReady, editorValue, editorConfig, handleChange } = useLexicalEditor(initialValue);

  // Call onChange prop when content changes
  useEffect(() => {
    if (onChange && content !== initialValue) {
      onChange(content);
    }
  }, [content, initialValue, onChange]);

  // If editor is not ready, show loading state
  if (!isReady) {
    return <div className="lexical-editor-loading">Loading editor...</div>;
  }

  return (
    <div className={`lexical-editor-container ${className}`}>
      <LexicalComposer initialConfig={{
        ...editorConfig,
        editorState: editorValue,
        editable: !readOnly,
        theme,
        nodes: [
          LinkNode,
          ListNode,
          ListItemNode,
          TableNode,
          TableCellNode,
          TableRowNode
        ],
      }}>
        {!readOnly && <LexicalToolbar />}
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<div className="editor-placeholder">{placeholder}</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={handleChange} />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <LinkPlugin />
          <ListPlugin />
          <TablePlugin />
        </div>
      </LexicalComposer>
    </div>
  );
};

// Export as dynamic component to avoid SSR issues
export default dynamic(() => Promise.resolve(LexicalEditor), {
  ssr: false,
});