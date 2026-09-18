/**
 * Type declarations for the browser-only bundle of mammoth.js.
 *
 * The upstream `mammoth` package ships full TypeScript types for the
 * Node entry point, but the lightweight `mammoth/mammoth.browser` file
 * we lazy-load in the TextEditor doesn't have its own .d.ts. Without
 * this declaration the TS compiler errors out with:
 *
 *   TS7016: Could not find a declaration file for module
 *   'mammoth/mammoth.browser'.
 *
 * The browser bundle exposes the same `convertToHtml` API we rely on,
 * so we re-export those types from the main package.
 */

declare module 'mammoth/mammoth.browser' {
  export interface ConvertToHtmlInput {
    arrayBuffer: ArrayBuffer;
  }

  export interface ConvertToHtmlOptions {
    styleMap?: string | string[];
    includeDefaultStyleMap?: boolean;
    includeEmbeddedStyleMap?: boolean;
    convertImage?: any;
    ignoreEmptyParagraphs?: boolean;
    idPrefix?: string;
    transformDocument?: any;
  }

  export interface MammothMessage {
    type: 'warning' | 'error' | 'info';
    message: string;
  }

  export interface ConvertToHtmlResult {
    value: string;
    messages: MammothMessage[];
  }

  export function convertToHtml(
    input: ConvertToHtmlInput,
    options?: ConvertToHtmlOptions,
  ): Promise<ConvertToHtmlResult>;

  export function extractRawText(
    input: ConvertToHtmlInput,
  ): Promise<ConvertToHtmlResult>;

  const mammoth: {
    convertToHtml: typeof convertToHtml;
    extractRawText: typeof extractRawText;
  };
  export default mammoth;
}
