import { Editor } from '@tinymce/tinymce-react';
import { FC } from 'react';
// Mammoth converts .docx → HTML in the browser, preserving headings, bold,
// italic, lists, tables, links, images, blockquote — i.e. everything you'd
// realistically need from a Google Docs / Word export. Loaded dynamically
// in the click handler so the main bundle stays small for editors that
// never use the import button.

/**
 * TextEditor — TinyMCE wrapper tuned for Google Docs / MS Word paste AND
 * direct .docx file import.
 *
 * Two ways to bring in content from outside the editor:
 *
 * 1. PASTE — Copy text from Google Docs / Word and paste here. The
 *    `paste_*` settings below keep the formatting (bold, headings, lists,
 *    tables) instead of stripping it.
 *
 * 2. IMPORT — Click the toolbar's "Import .docx" button, pick a Google
 *    Docs / Word export file, and Mammoth.js converts the entire document
 *    to HTML in the browser. No server upload, no server processing —
 *    everything happens client-side.
 *
 * Why two paths:
 *   Paste works for short/medium snippets but the clipboard frequently
 *   drops images and table styles. Uploading the original .docx is
 *   strictly higher fidelity for long-form content (the 2000-word SEO
 *   guides we publish to /search/[slug] pages).
 */

type EditorProps = {
  value?: string;
  setValue: any;
};

const TextEditor: FC<EditorProps> = ({ value, setValue }) => {
  return (
    <Editor
      value={value}
      onEditorChange={(newValue) => {
        setValue(newValue);
      }}
      apiKey="1zrjc8kpown0mcb2u2vf1k9z3j4bl50m3idblegn08mtomrq"
      init={{
        // -----------------------------------------------------------------
        // Plugins
        // -----------------------------------------------------------------
        plugins:
          'anchor autolink charmap codesample emoticons image link lists media quickbars searchreplace table visualblocks wordcount',

        toolbar:
          'undo redo | importdocx | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | link image media table | align lineheight | numlist bullist indent outdent | pastetext removeformat | emoticons charmap',

        // -----------------------------------------------------------------
        // Custom "Import .docx" toolbar button
        // -----------------------------------------------------------------
        // Registers a button that opens a hidden file picker, then converts
        // the chosen .docx with Mammoth and inserts the resulting HTML at
        // the caret. Anything previously selected in the editor is
        // replaced — same behaviour as a paste.
        setup: (editor: any) => {
          editor.ui.registry.addButton('importdocx', {
            // SVG icon — a small "upload + doc" glyph. Inline-registered so
            // we don't depend on TinyMCE's icon pack having an upload icon.
            icon: 'browse',
            text: 'Import .docx',
            tooltip:
              'Import a Word / Google Docs (.docx) file — preserves headings, bold, lists, tables',
            onAction: () => {
              // Build a one-shot <input type="file"> in memory. Avoids
              // adding a permanent DOM node and lets the browser handle
              // accessibility / multi-file rules natively.
              const input = document.createElement('input');
              input.type = 'file';
              input.accept =
                '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
              input.style.display = 'none';

              input.onchange = async (event: any) => {
                const file: File | undefined = event.target?.files?.[0];
                if (!file) return;

                // .doc (legacy Word) needs server-side conversion — Mammoth
                // only handles the modern .docx zip format. Fail loudly so
                // the writer knows to "Save As .docx" first.
                if (
                  file.name.toLowerCase().endsWith('.doc') &&
                  !file.name.toLowerCase().endsWith('.docx')
                ) {
                  window.alert(
                    'This is a legacy .doc file. Please open it in Word / Google Docs and save (or download) as .docx, then import again.',
                  );
                  return;
                }

                editor.setProgressState(true);
                try {
                  // Lazy-load mammoth so editor pages that never use the
                  // import button don't pay the download cost.
                  const mammoth = await import('mammoth/mammoth.browser');
                  const arrayBuffer = await file.arrayBuffer();

                  // Mammoth style map — keep semantic HTML for common Word
                  // styles that designers use. Headings 1-4 become h2-h4
                  // (we reserve <h1> for the page title), bold/italic stay
                  // inline.
                  const result = await mammoth.convertToHtml(
                    { arrayBuffer },
                    {
                      styleMap: [
                        "p[style-name='Title'] => h2:fresh",
                        "p[style-name='Heading 1'] => h2:fresh",
                        "p[style-name='Heading 2'] => h3:fresh",
                        "p[style-name='Heading 3'] => h4:fresh",
                        "p[style-name='Heading 4'] => h4:fresh",
                        "p[style-name='Quote'] => blockquote:fresh",
                        "b => strong",
                        "i => em",
                      ],
                    },
                  );

                  // Replace any current selection with the imported HTML.
                  // The editor's own paste filters do NOT run on
                  // insertContent, so the Mammoth output lands verbatim.
                  editor.insertContent(result.value);

                  if (result.messages?.length) {
                    // Surface only conversion warnings worth noting (e.g.
                    // unsupported style mapped to default). Errors/empty
                    // documents already throw.
                    // eslint-disable-next-line no-console
                    console.info(
                      '[Editor] .docx import — Mammoth conversion notes:',
                      result.messages,
                    );
                  }
                } catch (err) {
                  // eslint-disable-next-line no-console
                  console.error('[Editor] .docx import failed:', err);
                  window.alert(
                    'Could not read this .docx file. It may be password-protected, corrupted, or saved in an old format. Try re-exporting from Google Docs / Word and importing again.',
                  );
                } finally {
                  editor.setProgressState(false);
                }
              };

              document.body.appendChild(input);
              input.click();
              // Clean up the input after the user has either picked or
              // cancelled (fires on blur of the dialog).
              window.setTimeout(() => {
                if (input.parentNode) input.parentNode.removeChild(input);
              }, 60_000);
            },
          });
        },

        // -----------------------------------------------------------------
        // PASTE — preserve Google Docs / Word formatting
        // -----------------------------------------------------------------
        paste_as_text: false,
        paste_data_images: true,
        paste_block_drop: false,
        paste_remove_styles_if_webkit: false,
        paste_webkit_styles: 'all',
        paste_retain_style_properties: 'all',
        paste_merge_formats: true,
        smart_paste: true,

        // Allow EVERYTHING by default. The preprocess hook strips only
        // Office/Docs-specific noise.
        valid_elements: '*[*]',
        extended_valid_elements:
          'h1[id|class|style],h2[id|class|style],h3[id|class|style],h4[id|class|style],h5[id|class|style],h6[id|class|style],' +
          'p[id|class|style|align],span[id|class|style],div[id|class|style],br,hr,' +
          'b,strong,i,em,u,s,strike,sub,sup,mark,small,' +
          'ol[start|type|style],ul[style],li[style],' +
          'a[href|target|rel|title|class|style],' +
          'img[src|alt|title|width|height|class|style],' +
          'table[border|cellpadding|cellspacing|style|class],thead,tbody,tfoot,' +
          'tr[style|class],td[style|class|colspan|rowspan],th[style|class|colspan|rowspan|scope],' +
          'blockquote[style|class|cite],code,pre[class|style],' +
          'figure[class|style],figcaption[class|style]',

        valid_styles: {
          '*': 'color,background-color,font-weight,font-style,font-size,font-family,text-decoration,text-align,vertical-align,padding,padding-left,padding-right,padding-top,padding-bottom,margin,margin-left,margin-right,margin-top,margin-bottom,border,border-color,border-width,border-style,line-height,list-style-type,width,height,max-width,min-width,float,clear,display',
        },

        paste_preprocess: (_plugin: any, args: any) => {
          if (!args?.content) return;
          args.content = args.content
            .replace(
              /<span[^>]*id="docs-internal-guid-[^"]*"[^>]*>/gi,
              '',
            )
            .replace(/<\/?o:p[^>]*>/gi, '')
            .replace(/style="[^"]*mso-[^"]*"/gi, '')
            .replace(
              /<span class="Apple-converted-space"[^>]*>([^<]*)<\/span>/gi,
              '$1',
            );
        },

        forced_root_block: 'p',
        cleanup: false,
        convert_urls: false,
        entity_encoding: 'raw',
        convert_fonts_to_spans: true,

        quickbars_selection_toolbar:
          'bold italic underline | h2 h3 | blockquote | bullist numlist | link',
        quickbars_insert_toolbar: 'quickimage quicktable',

        block_formats:
          'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Blockquote=blockquote',

        height: 600,
        menubar: 'edit view insert format tools table',
        branding: false,
        promotion: false,
      }}
    />
  );
};

export default TextEditor;
