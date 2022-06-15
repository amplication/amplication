import React from "react";
import { App } from "../../models";
import { FileDetails } from "./CodeViewPage";
import AppGitStatusPanel from "../git/AppGitStatusPanel";
import CodeViewExplorer from "./CodeViewExplorer";
import "./CodeViewBar.scss";

type Props = {
  app: App;
  onFileSelected: (selectedFile: FileDetails | null) => void;
};
const CLASS_NAME = "code-view-bar";

const CodeViewBar = ({ app, onFileSelected }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__heading`}>
        <h2>File Browser</h2>
      </div>
      <AppGitStatusPanel app={app} showDisconnectedMessage />
      <hr />
      <CodeViewExplorer app={app} onFileSelected={onFileSelected} />
    </div>
  );
};

export default CodeViewBar;
