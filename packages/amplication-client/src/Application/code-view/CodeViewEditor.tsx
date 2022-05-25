import MonacoEditor from "@monaco-editor/react";
import React, { useLayoutEffect, useState } from "react";
import { StorageBaseAxios } from "./StorageBaseAxios";

type Props = {
  appId: string;
  buildId: string;
  filePath: string;
  fileName: string;
};

const CodeViewEditor = ({ appId, buildId, filePath, fileName }: Props) => {
  const [content, setContent] = useState<string>("");

  const path = filePath;


  
  

  useLayoutEffect(() => {
    (async () => {
      if (!path) {
        return;
      }

      const data = await StorageBaseAxios.instance.fileContent(
        appId,
        buildId,
        path
      );

      setContent(data);
    })();
  }, [appId, buildId, filePath, path]);

  if (!path) {
    return <div />;
  }

  return (
    <MonacoEditor
    beforeMount={setEditorTheme}
      
      height="100%"
      value={content}
      options={{ readOnly: true }}
      path={path}
      theme={"vs-dark-amp"}
    />
  );
};

export default CodeViewEditor;


function setEditorTheme(monaco: any) {
  monaco.editor.defineTheme("vs-dark-amp", {
    base: "vs-dark",
    inherit: true,
    rules: [
    ],
    colors: {
      "editor.background": '#15192c',
    },
  });
}