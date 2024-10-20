import React, { useState } from "react";
import "./CodeCompare.scss";

import { DiffEditor, Monaco, MonacoDiffEditor } from "@monaco-editor/react";

export type Props = {
  newVersion: string;
  oldVersion: string;
  autoHeight?: boolean;
  language?: string;
};

const CLASS_NAME = "amp-code-compare";

const setEditorTheme = (monaco: Monaco) => {
  monaco.editor.defineTheme("vs-dark-amp", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#15192c",
    },
  });
};

export const CodeCompare: React.FC<Props> = ({
  newVersion,
  oldVersion,
  autoHeight = true,
  language = "yaml",
}) => {
  const [editorHeight, setEditorHeight] = useState(200); // Initial height

  const handleBeforeMount = (monaco: Monaco) => {
    setEditorTheme(monaco);
  };

  const handleEditorDidMount = (editor: MonacoDiffEditor, monaco: Monaco) => {
    if (!autoHeight) {
      return;
    }

    const editorModel = editor.getModel();

    if (!editorModel) {
      return;
    }

    const originalModel = editorModel.original;
    const modifiedModel = editorModel.modified;

    // Function to calculate the maximum content height from both models
    const updateEditorHeight = () => {
      const lineHeight = editor
        .getOriginalEditor()
        .getOption(monaco.editor.EditorOption.lineHeight);
      const originalLineCount = originalModel.getLineCount();
      const modifiedLineCount = modifiedModel.getLineCount();

      // Calculate the height based on the largest model (original or modified)
      const maxLineCount = Math.max(originalLineCount, modifiedLineCount);
      const height = maxLineCount * lineHeight;

      setEditorHeight(height); // Set the new height
    };

    // Attach event listener to changes in both models (original and modified)
    originalModel.onDidChangeContent(() => updateEditorHeight());
    modifiedModel.onDidChangeContent(() => updateEditorHeight());

    // Initial height adjustment
    updateEditorHeight();
  };

  return (
    <DiffEditor
      className={CLASS_NAME}
      height={autoHeight ? editorHeight : undefined}
      language={language}
      original={oldVersion}
      modified={newVersion}
      beforeMount={handleBeforeMount}
      onMount={handleEditorDidMount}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        scrollbar: {
          alwaysConsumeMouseWheel: false,
        },
      }}
      theme={"vs-dark-amp"}
    />
  );
};
