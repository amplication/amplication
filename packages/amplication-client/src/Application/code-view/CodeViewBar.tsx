import React from "react";
import { App } from "../../models";
import { FileDetails } from "./CodeViewPage";
import CodeViewSyncWithGithub from "./CodeViewSyncWithGithub";
import CodeViewExplorer from "./CodeViewExplorer";
import "./CodeViewBar.scss";

const CLASS_NAME = "code-view-bar";

type Props = {
  app: App;
  onFileSelected: (selectedFile: FileDetails | null) => void;
};

const CodeViewBar = ({ app, onFileSelected }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__heading`}>
        <h2>File Browser</h2>
      </div>
      <CodeViewSyncWithGithub app={app} />

      <CodeViewExplorer app={app} onFileSelected={onFileSelected} />
    </div>
  );
};

export default CodeViewBar;
