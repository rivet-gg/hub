import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter } from "@codemirror/lint";
import { githubDark } from "@uiw/codemirror-theme-github";
import ReactCodeMirror, {
  type ReactCodeMirrorProps,
} from "@uiw/react-codemirror";
import { CodeMirrorContainer } from "./code-mirror-container";

interface JsonCodeProps extends ReactCodeMirrorProps {}

export const JsonCode = ({
  value,
  extensions = [],
  ...props
}: JsonCodeProps) => {
  return (
    <CodeMirrorContainer>
      <ReactCodeMirror
        {...props}
        extensions={[json(), linter(jsonParseLinter()), ...extensions]}
        theme={githubDark}
        value={value}
      />
    </CodeMirrorContainer>
  );
};
