import React from "react";
import { Resource } from "../../models";
import { FileDetails } from "./CodeViewPage";
import AppGitStatusPanel from "../git/AppGitStatusPanel";
import CodeViewExplorer from "./CodeViewExplorer";
import "./CodeViewBar.scss";

type Props = {
  resource: Resource;
  onFileSelected: (selectedFile: FileDetails | null) => void;
};
const CLASS_NAME = "code-view-bar";

const CodeViewBar = ({ resource, onFileSelected }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__heading`}>
        <h2>File Browser</h2>
      </div>
      <AppGitStatusPanel resource={resource} showDisconnectedMessage />
      <hr />
      <CodeViewExplorer resource={resource} onFileSelected={onFileSelected} />
    </div>
  );
};

export default CodeViewBar;
