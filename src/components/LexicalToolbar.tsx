'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  LexicalNode,
  RangeSelection
} from 'lexical';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $isListNode,
  ListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import { $createParagraphNode } from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $getNearestNodeOfType } from '@lexical/utils';
import { $isTableNode, $isTableCellNode, $createTableNodeWithDimensions, INSERT_TABLE_COMMAND } from '@lexical/table';

const LexicalToolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBulletList, setIsBulletList] = useState(false);
  const [isNumberList, setIsNumberList] = useState(false);
  const [isTable, setIsTable] = useState(false);

  // Update toolbar state based on selection
  const getSelectedNode = (selection: RangeSelection): LexicalNode => {
    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();
    if (anchorNode === focusNode) {
      return anchorNode;
    }
    const commonAncestor = anchorNode.getCommonAncestor(focusNode);
    return commonAncestor || anchorNode;
  };

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      // Check for lists
      const anchorNode = selection.anchor.getNode();
      const parentList = $getNearestNodeOfType(anchorNode, ListNode);
      setIsBulletList(parentList !== null && parentList.getListType() === 'bullet');
      setIsNumberList(parentList !== null && parentList.getListType() === 'number');
    }
  }, []);

  // Register update listener
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  // Button click handlers
  const handleBoldClick = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const handleItalicClick = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  const handleUnderlineClick = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  };

  const handleLinkClick = () => {
    if (isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    } else {
      const url = prompt('Enter URL');
      if (url) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      }
    }
  };

  const handleBulletListClick = () => {
    if (isBulletList) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  };

  const handleNumberListClick = () => {
    if (isNumberList) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const handleUndoClick = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };

  const handleRedoClick = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  return (
    <div className="lexical-toolbar flex flex-wrap gap-1 p-1 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-md">
      <button
        type="button"
        className={`toolbar-item p-1 rounded ${isBold ? 'bg-gray-300 dark:bg-gray-600' : ''}`}
        onClick={handleBoldClick}
        aria-label="Format Bold"
      >
        <span className="font-bold">B</span>
      </button>
      <button
        type="button"
        className={`toolbar-item p-1 rounded ${isItalic ? 'bg-gray-300 dark:bg-gray-600' : ''}`}
        onClick={handleItalicClick}
        aria-label="Format Italic"
      >
        <span className="italic">I</span>
      </button>
      <button
        type="button"
        className={`toolbar-item p-1 rounded ${isUnderline ? 'bg-gray-300 dark:bg-gray-600' : ''}`}
        onClick={handleUnderlineClick}
        aria-label="Format Underline"
      >
        <span className="underline">U</span>
      </button>
      <div className="toolbar-divider mx-1 border-r border-gray-300 dark:border-gray-600"></div>
      <button
        type="button"
        className={`toolbar-item p-1 rounded ${isLink ? 'bg-gray-300 dark:bg-gray-600' : ''}`}
        onClick={handleLinkClick}
        aria-label="Insert Link"
      >
        <span>🔗</span>
      </button>
      <div className="toolbar-divider mx-1 border-r border-gray-300 dark:border-gray-600"></div>
      <button
        type="button"
        className={`toolbar-item p-1 rounded ${isBulletList ? 'bg-gray-300 dark:bg-gray-600' : ''}`}
        onClick={handleBulletListClick}
        aria-label="Bullet List"
      >
        <span>• List</span>
      </button>
      <button
        type="button"
        className={`toolbar-item p-1 rounded ${isNumberList ? 'bg-gray-300 dark:bg-gray-600' : ''}`}
        onClick={handleNumberListClick}
        aria-label="Number List"
      >
        <span>1. List</span>
      </button>
      <div className="toolbar-divider mx-1 border-r border-gray-300 dark:border-gray-600"></div>
      <button
        type="button"
        className="toolbar-item p-1 rounded"
        onClick={handleUndoClick}
        aria-label="Undo"
      >
        <span>↩️</span>
      </button>
      <button
        type="button"
        className="toolbar-item p-1 rounded"
        onClick={handleRedoClick}
        aria-label="Redo"
      >
        <span>↪️</span>
      </button>
      
      <div className="toolbar-divider mx-1 border-r border-gray-300 dark:border-gray-600"></div>
      
      {/* Table Button */}
      <button
        type="button"
        className="toolbar-item p-1 rounded"
        onClick={() => {
          editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns: '3', rows: '3' });
        }}
        aria-label="Insert Table"
        title="Insert 3x3 Table"
      >
        <span>📊</span>
      </button>
    </div>
  );
};

export default LexicalToolbar;