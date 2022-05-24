import MonacoEditor from "@monaco-editor/react";
import React, { useLayoutEffect, useState } from "react";
import useNavigationTabs from "../../Layout/UseNavigationTabs";
import { StorageBaseAxios } from "./StorageBaseAxios";

type Props = {
  appId: string;
  buildId: string;
  filePath: string;
  fileName: string;
};
const NAVIGATION_KEY = "CODE_VIEW";

const CodeViewEditor = ({ appId, buildId, filePath, fileName }: Props) => {
  const [content, setContent] = useState<string>("");

  const path = filePath;

  useNavigationTabs(appId, NAVIGATION_KEY, path || "", fileName);

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
      height="90vh"
      value={content}
      options={{ readOnly: true }}
      path={path}
      theme={"vs-dark"}
    />
  );
};

export default CodeViewEditor;
