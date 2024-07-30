import { CodeEditor } from "@amplication/ui/design-system";
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
    <CodeEditor value={content} options={{ readOnly: true }} path={filePath} />
  );
};

export default CodeViewEditor;
