import React, { useEffect, useState } from "react";
import MonacoEditor, { EditorProps, Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "./CodeEditor.scss";

export const isValidJSON = (str: string) => {
  try {
    return JSON.parse(str) && !!str;
  } catch (e) {
    return false;
  }
};

export interface CodeEditorProps {
  width?: string;
  height?: string;
  value?: string | { [key: string]: any };
  defaultValue?: string | { [key: string]: any };
  defaultLanguage?: EditorProps["defaultLanguage"];
  options?: EditorProps["options"];
  beforeMount?: EditorProps["beforeMount"];
  onMount?: EditorProps["onMount"];
  onValidate?: EditorProps["onValidate"];
  onChange?: EditorProps["onChange"];
  className?: EditorProps["className"];
  path?: string;
  resetKey?: string;
}

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

export const CodeEditor: React.FC<CodeEditorProps> = ({
  width = "100%",
  height = "100vh",
  value = null,
  defaultValue = null,
  defaultLanguage = "json",
  options = {
    selectOnLineNumbers: true,
    readOnly: false,
    minimap: { enabled: false },
  },
  beforeMount,
  onMount,
  onValidate,
  onChange,
  className,
  resetKey,
  path,
}) => {
  const [isValid, setIsValid] = useState<boolean>(true);
  const [editorValue, setEditorValue] = useState<string | undefined>(
    value ? JSON.stringify(value) : JSON.stringify(defaultValue)
  );

  useEffect(() => {
    if (defaultValue && !value) setEditorValue(JSON.stringify(defaultValue));

    value && setEditorValue(JSON.stringify(value));
  }, [value, defaultValue]);

  useEffect(() => {
    if (!resetKey) return;

    setEditorValue(JSON.stringify(defaultValue));
  }, [resetKey, defaultValue]);

  const handleBeforeMount = (monaco: Monaco) => {
    setEditorTheme(monaco);
    beforeMount && beforeMount(monaco);
  };

  const handleOnMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    onMount && onMount(editor, monaco);
  };

  const handleOnValidate = (markers: monaco.editor.IMarker[]) => {
    setIsValid(markers.length === 0);

    onValidate && onValidate(markers);
  };

  const handleOnChange = (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent
  ) => {
    setEditorValue(value);

    onChange && onChange(value, ev);
  };

  console.log("editorValue", editorValue);

  return (
    <div
      className={`json-editor${className || ""}${
        !isValid ? " editor--invalid" : ""
      }`}
    >
      <MonacoEditor
        width={width}
        height={height}
        beforeMount={handleBeforeMount}
        onMount={handleOnMount}
        onValidate={handleOnValidate}
        onChange={handleOnChange}
        {...(editorValue ? { value: editorValue } : {})}
        defaultLanguage={defaultLanguage}
        options={options}
        path={path}
        theme={"vs-dark-amp"}
      />
    </div>
  );
};
