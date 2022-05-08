import React from "react";

import Editor from "@monaco-editor/react";

const CodeViewEditor = () => {
  return (
    <Editor
      height="90vh"
      defaultLanguage="typescript"
      defaultValue="// some comment"
    />
  );
};

export default CodeViewEditor;
