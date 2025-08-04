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

// Define theme for the editor with table and list styling
const theme = {
  paragraph: 'editor-paragraph',
  text: {
    bold: 'editor-text-bold font-bold',
    italic: 'editor-text-italic italic',
    underline: 'editor-text-underline underline',
  },
  heading: {
    h1: 'editor-heading-h1 text-2xl font-bold mb-4',
    h2: 'editor-heading-h2 text-xl font-bold mb-3',
    h3: 'editor-heading-h3 text-lg font-bold mb-2',
    h4: 'editor-heading-h4 text-base font-bold mb-2',
    h5: 'editor-heading-h5 text-sm font-bold mb-1',
    h6: 'editor-heading-h6 text-xs font-bold mb-1',
  },
  list: {
    nested: {
      listitem: 'editor-list-item-nested',
    },
    ol: 'editor-list-ol list-decimal ml-5 space-y-1',
    ul: 'editor-list-ul list-disc ml-5 space-y-1',
    listitem: 'editor-list-item',
  },
  table: 'editor-table border-collapse border border-gray-300 dark:border-gray-600 w-full',
  tableCell: 'editor-table-cell border border-gray-300 dark:border-gray-600 px-4 py-2',
  tableCellHeader: 'editor-table-cell-header border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-50 dark:bg-gray-800 font-semibold',
  tableRow: 'editor-table-row',
  link: 'editor-link text-indigo-600 dark:text-indigo-400 hover:underline',
  code: 'editor-code bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono text-sm',
  codeBlock: 'editor-code-block bg-gray-50 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm border border-gray-200 dark:border-gray-700',
  quote: 'editor-quote border-l-4 border-indigo-300 dark:border-indigo-600 pl-4 italic text-gray-700 dark:text-gray-300',
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