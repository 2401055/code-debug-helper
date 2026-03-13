import { useEffect, useRef, useCallback } from "react";
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
  Decoration,
  DecorationSet,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from "@codemirror/view";
import { EditorState, Compartment, StateField, StateEffect, RangeSet } from "@codemirror/state";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap,
} from "@codemirror/language";
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { lintGutter } from "@codemirror/lint";
import { oneDark } from "@codemirror/theme-one-dark";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { php } from "@codemirror/lang-php";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";
import { markdown } from "@codemirror/lang-markdown";
import { json } from "@codemirror/lang-json";

const languageMap: Record<string, () => any> = {
  javascript: () => javascript({ jsx: true, typescript: false }),
  typescript: () => javascript({ jsx: true, typescript: true }),
  python: () => python(),
  java: () => java(),
  c: () => cpp(),
  cpp: () => cpp(),
  csharp: () => java(),
  html: () => html(),
  css: () => css(),
  php: () => php(),
  rust: () => rust(),
  sql: () => sql(),
  xml: () => xml(),
  markdown: () => markdown(),
  json: () => json(),
  go: () => java(),
  ruby: () => python(),
  swift: () => java(),
  kotlin: () => java(),
};

interface InlineError {
  line: number;
  message: string;
}

// Custom widget for inline error messages
class ErrorWidget extends WidgetType {
  constructor(readonly message: string) {
    super();
  }
  toDOM() {
    const span = document.createElement("span");
    span.className = "cm-error-widget";
    span.textContent = ` ⚠ ${this.message}`;
    span.style.cssText =
      "color: oklch(0.7 0.2 25); font-size: 11px; font-style: italic; opacity: 0.85; margin-left: 12px; padding: 1px 6px; background: oklch(0.2 0.05 25); border-radius: 3px;";
    return span;
  }
}

// State effect for setting errors
const setErrorsEffect = StateEffect.define<InlineError[]>();

// State field to store error decorations
const errorField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    for (const effect of tr.effects) {
      if (effect.is(setErrorsEffect)) {
        const errors = effect.value;
        const decos: any[] = [];
        for (const err of errors) {
          const lineNum = err.line;
          if (lineNum >= 1 && lineNum <= tr.state.doc.lines) {
            const line = tr.state.doc.line(lineNum);
            // Add red underline to the whole line
            decos.push(
              Decoration.mark({
                class: "cm-error-line",
              }).range(line.from, line.to)
            );
            // Add error widget at end of line
            decos.push(
              Decoration.widget({
                widget: new ErrorWidget(err.message),
                side: 1,
              }).range(line.to)
            );
          }
        }
        return Decoration.set(decos, true);
      }
    }
    return decorations;
  },
  provide: (f) => EditorView.decorations.from(f),
});

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  readOnly?: boolean;
  minHeight?: string;
  inlineErrors?: InlineError[];
}

export default function CodeEditor({
  value,
  onChange,
  language,
  readOnly = false,
  minHeight = "300px",
  inlineErrors = [],
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const langCompartment = useRef(new Compartment());
  const readOnlyCompartment = useRef(new Compartment());

  const getLanguageExtension = useCallback((lang: string) => {
    const factory = languageMap[lang.toLowerCase()];
    return factory ? factory() : javascript({ jsx: true });
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        lintGutter(),
        errorField,
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...completionKeymap,
          indentWithTab,
        ]),
        langCompartment.current.of(getLanguageExtension(language)),
        readOnlyCompartment.current.of(EditorState.readOnly.of(readOnly)),
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          "&": {
            backgroundColor: "oklch(0.15 0.015 265)",
            minHeight: minHeight,
          },
          ".cm-content": {
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: "14px",
            padding: "8px 0",
          },
          ".cm-gutters": {
            backgroundColor: "oklch(0.13 0.015 265)",
            color: "oklch(0.45 0.015 265)",
            borderRight: "1px solid oklch(0.25 0.015 265)",
          },
          ".cm-activeLineGutter": {
            backgroundColor: "oklch(0.2 0.015 265)",
          },
          ".cm-activeLine": {
            backgroundColor: "oklch(0.18 0.015 265)",
          },
          ".cm-cursor": {
            borderLeftColor: "oklch(0.65 0.2 250)",
          },
          ".cm-selectionBackground": {
            backgroundColor: "oklch(0.35 0.1 250) !important",
          },
          "&.cm-focused .cm-selectionBackground": {
            backgroundColor: "oklch(0.35 0.1 250) !important",
          },
          ".cm-error-line": {
            textDecoration: "wavy underline oklch(0.65 0.25 25)",
            textUnderlineOffset: "3px",
            backgroundColor: "oklch(0.2 0.04 25 / 0.3)",
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update language
  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.dispatch({
        effects: langCompartment.current.reconfigure(
          getLanguageExtension(language)
        ),
      });
    }
  }, [language, getLanguageExtension]);

  // Update readOnly
  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.dispatch({
        effects: readOnlyCompartment.current.reconfigure(
          EditorState.readOnly.of(readOnly)
        ),
      });
    }
  }, [readOnly]);

  // Sync external value changes
  useEffect(() => {
    if (viewRef.current) {
      const currentValue = viewRef.current.state.doc.toString();
      if (value !== currentValue) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: value,
          },
        });
      }
    }
  }, [value]);

  // Update inline errors
  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.dispatch({
        effects: setErrorsEffect.of(inlineErrors),
      });
    }
  }, [inlineErrors]);

  return (
    <div
      ref={editorRef}
      className="rounded-lg border border-border overflow-hidden"
      style={{ minHeight }}
    />
  );
}
