import MonacoEditor from "@monaco-editor/react";
import React, { useLayoutEffect, useMemo, useState } from "react";
import { StorageBaseAxios } from "./StorageBaseAxios";

type Props = {
  resourceId: string;
  buildId: string;
  filePath: string;
  fileName: string;
};

const UNSUPPORTED_EXTENSIONS = ["png", "ico"];
const UNSUPPORTED_EXTENSION_MESSAGE = "Preview is not available";

function setEditorTheme(monaco: any) {
  monaco.editor.defineTheme("vs-dark-amp", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#15192c",
    },
  });
}

const CodeViewEditor = ({ resourceId, buildId, filePath, fileName }: Props) => {
  const [content, setContent] = useState<string>("");

  const fileExtension = useMemo(() => {
    return fileName.split(".").pop();
  }, [fileName]);
  useLayoutEffect(() => {
    (async () => {
      if (!filePath) return;

      const data =
        fileExtension &&
        UNSUPPORTED_EXTENSIONS.includes(fileExtension.toLocaleLowerCase())
          ? UNSUPPORTED_EXTENSION_MESSAGE
          : await StorageBaseAxios.instance.fileContent(
              resourceId,
              buildId,
              filePath
            );

      setContent(data);
    })();
  }, [resourceId, buildId, filePath, fileExtension]);

  return !filePath ? (
    <div />
  ) : (
    <MonacoEditor
      beforeMount={setEditorTheme}
      height="100%"
      value={content}
      options={{ readOnly: true }}
      path={filePath}
      theme={"vs-dark-amp"}
    />
  );
};

export default CodeViewEditor;
