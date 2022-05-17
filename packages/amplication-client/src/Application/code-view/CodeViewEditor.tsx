import Editor from "@monaco-editor/react";
import React, { useLayoutEffect, useState } from "react";
import { match, useLocation } from "react-router-dom";
import useNavigationTabs from "../../Layout/UseNavigationTabs";
import { StorageBaseAxios } from "./StorageBaseAxios";

type Props = {
  match: match<{ appId: string; buildId: string; filePath: string }>;
};
const NAVIGATION_KEY = "CODE_VIEW";

const CodeViewEditor = ({ match }: Props) => {
  const { search } = useLocation();
  const query = React.useMemo(() => new URLSearchParams(search), [search]);
  const { params } = match;
  const { appId, buildId, filePath } = params;
  const [content, setContent] = useState<string>("");

  const path = query.get("path");

  useNavigationTabs(appId, NAVIGATION_KEY, path || "");
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
    <Editor
      height="90vh"
      value={content}
      options={{ readOnly: true }}
      path={path}
      theme={"vs-dark"}
    />
  );
};

export default CodeViewEditor;
