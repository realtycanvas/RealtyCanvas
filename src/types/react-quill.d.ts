declare module 'react-quill' {
  import React from 'react';
  import Quill from 'quill';

  export interface ReactQuillProps {
    id?: string;
    className?: string;
    theme?: string;
    style?: React.CSSProperties;
    readOnly?: boolean;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    tabIndex?: number;
    bounds?: string | HTMLElement;
    scrollingContainer?: string | HTMLElement;
    onChange?: (content: string, delta: any, source: any, editor: any) => void;
    onChangeSelection?: (range: any, source: any, editor: any) => void;
    onFocus?: (range: any, source: any, editor: any) => void;
    onBlur?: (previousRange: any, source: any, editor: any) => void;
    onKeyPress?: React.KeyboardEventHandler<HTMLDivElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
    onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>;
    formats?: string[];
    children?: React.ReactElement<any>;
    modules?: Record<string, any>;
    preserveWhitespace?: boolean;
  }

  export interface QuillOptions {
    debug?: boolean | string;
    modules?: Record<string, any>;
    placeholder?: string;
    readOnly?: boolean;
    theme?: string;
    formats?: string[];
    bounds?: HTMLElement | string;
    scrollingContainer?: HTMLElement | string;
    strict?: boolean;
  }

  export interface QuillModule {
    register: (path: string, def: any, override?: boolean) => void;
  }

  export default class ReactQuill extends React.Component<ReactQuillProps> {
    focus(): void;
    blur(): void;
    getEditor(): any;
    static Quill: typeof Quill;
  }
}

declare module 'quill' {
  export interface QuillOptions {
    debug?: boolean | string;
    modules?: Record<string, any>;
    placeholder?: string;
    readOnly?: boolean;
    theme?: string;
    formats?: string[];
    bounds?: HTMLElement | string;
    scrollingContainer?: HTMLElement | string;
    strict?: boolean;
  }

  export default class Quill {
    constructor(container: string | Element, options?: QuillOptions);
    deleteText(index: number, length: number, source?: string): void;
    disable(): void;
    enable(enabled?: boolean): void;
    getContents(index?: number, length?: number): Delta;
    getLength(): number;
    getText(index?: number, length?: number): string;
    insertEmbed(index: number, type: string, value: any, source?: string): void;
    insertText(index: number, text: string, source?: string): void;
    insertText(index: number, text: string, format: string, value: any, source?: string): void;
    insertText(index: number, text: string, formats: Record<string, any>, source?: string): void;
    pasteHTML(index: number, html: string, source?: string): void;
    pasteHTML(html: string, source?: string): void;
    setContents(delta: Delta, source?: string): void;
    setText(text: string, source?: string): void;
    update(source?: string): void;
    updateContents(delta: Delta, source?: string): void;

    format(name: string, value: any, source?: string): void;
    formatLine(index: number, length: number, source?: string): void;
    formatLine(index: number, length: number, format: string, value: any, source?: string): void;
    formatLine(index: number, length: number, formats: Record<string, any>, source?: string): void;
    formatText(index: number, length: number, source?: string): void;
    formatText(index: number, length: number, format: string, value: any, source?: string): void;
    formatText(index: number, length: number, formats: Record<string, any>, source?: string): void;
    getFormat(range?: Range): Record<string, any>;
    getFormat(index: number, length?: number): Record<string, any>;
    removeFormat(index: number, length: number, source?: string): void;

    blur(): void;
    focus(): void;
    getBounds(index: number, length?: number): Bounds;
    getSelection(focus?: boolean): Range;
    hasFocus(): boolean;
    setSelection(index: number, length: number, source?: string): void;
    setSelection(range: Range, source?: string): void;

    on(eventName: string, handler: Function): Quill;
    once(eventName: string, handler: Function): Quill;
    off(eventName: string, handler: Function): Quill;

    static register(path: string, def: any, override?: boolean): void;
    static register(defs: Record<string, any>, override?: boolean): void;
    static import(path: string): any;
    static find(domNode: Node): Quill | null;
    static debug(level: string | boolean): void;
    static version: string;
  }

  export interface Delta {
    ops?: Op[];
    retain(length: number, attributes?: Record<string, any>): Delta;
    delete(length: number): Delta;
    filter(predicate: (op: Op) => boolean): Op[];
    forEach(predicate: (op: Op) => void): void;
    insert(text: string, attributes?: Record<string, any>): Delta;
    map<T>(predicate: (op: Op) => T): T[];
    partition(predicate: (op: Op) => boolean): [Op[], Op[]];
    reduce<T>(predicate: (acc: T, curr: Op, idx: number, arr: Op[]) => T, initial: T): T;
    chop(): Delta;
    length(): number;
    slice(start?: number, end?: number): Delta;
    compose(other: Delta): Delta;
    concat(other: Delta): Delta;
    diff(other: Delta, index?: number): Delta;
    eachLine(predicate: (line: Delta, attributes: Record<string, any>, idx: number) => any, newline?: string): Delta;
    transform(index: number, priority?: boolean): number;
    transform(other: Delta, priority?: boolean): Delta;
    transformPosition(index: number, priority?: boolean): number;
  }

  export interface Op {
    insert?: string | Record<string, any>;
    delete?: number;
    retain?: number;
    attributes?: Record<string, any>;
  }

  export interface Range {
    index: number;
    length: number;
  }

  export interface Bounds {
    left: number;
    top: number;
    height: number;
    width: number;
  }
}