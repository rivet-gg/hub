import { javascript } from "@codemirror/lang-javascript";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";
import { githubDark } from "@uiw/codemirror-theme-github";
import ReactCodeMirror, {
  type ReactCodeMirrorProps,
} from "@uiw/react-codemirror";
import { forwardRef } from "react";
import { CodeMirrorContainer } from "./code-mirror-container";

interface JsonCodeProps extends ReactCodeMirrorProps {}

export const JsonCode = forwardRef<HTMLDivElement, JsonCodeProps>(
  ({ value, extensions = [], ...props }, ref) => {
    return (
      <CodeMirrorContainer ref={ref}>
        <ReactCodeMirror
          {...props}
          extensions={[json(), linter(jsonParseLinter()), ...extensions]}
          theme={githubDark}
          value={value}
        />
      </CodeMirrorContainer>
    );
  },
);

export const JavaScriptCode = forwardRef<HTMLDivElement, JsonCodeProps>(
  ({ value, extensions = [], ...props }, ref) => {
    return (
      <CodeMirrorContainer ref={ref}>
        <ReactCodeMirror
          {...props}
          basicSetup={{}}
          extensions={[javascript(), EditorView.lineWrapping, ...extensions]}
          theme={githubDark}
          value={value}
        />
      </CodeMirrorContainer>
    );
  },
);
