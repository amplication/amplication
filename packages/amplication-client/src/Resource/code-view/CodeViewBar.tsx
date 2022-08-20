import React from "react";
// import { Resource } from "../../models";
import { FileDetails } from "./CodeViewPage";
// import AppGitStatusPanel from "../git/AppGitStatusPanel";
import CodeViewExplorer from "./CodeViewExplorer";
import "./CodeViewBar.scss";

type Props = {
  onFileSelected: (selectedFile: FileDetails | null) => void;
};
const CLASS_NAME = "code-view-bar";

const CodeViewBar = ({ onFileSelected }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__heading`}>
        <h2>File Browser</h2>
      </div>
      {/* <AppGitStatusPanel resource={resource} showDisconnectedMessage /> */}
      {/* <hr /> */}
      <CodeViewExplorer onFileSelected={onFileSelected} />
    </div>
  );
};

export default CodeViewBar;
