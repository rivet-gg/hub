import { json } from "@codemirror/lang-json";
import { githubDark } from "@uiw/codemirror-theme-github";
import ReactCodeMirror from "@uiw/react-codemirror";
import { CodeMirrorContainer } from "./code-mirror-container";

export const JsonCode = ({ value }: { value: unknown }) => {
  return (
    <CodeMirrorContainer>
      <ReactCodeMirror
        readOnly
        extensions={[json()]}
        theme={githubDark}
        value={JSON.stringify(value, null, 2)}
      />
    </CodeMirrorContainer>
  );
};
