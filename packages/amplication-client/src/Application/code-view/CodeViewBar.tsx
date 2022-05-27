import { isEmpty } from "lodash";
import React from "react";
import { App } from "../../models";
import { FileDetails } from "./CodeViewPage";
import CodeViewSyncWithGithub from "./CodeViewSyncWithGithub";
import CodeViewExplorer from "./CodeViewExplorer";
import "./CodeViewBar.scss";

const CLASS_NAME = "code-view-bar";

type Props = {
  app: App;
  onFileSelected: (selectedFile: FileDetails) => void;
};

const CodeViewBar = ({ app, onFileSelected }: Props) => {
  const { gitRepository } = app;

  const handleAuthWithGitClick = () => {
    window.open(`/${app.id}/github`);
  };

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__heading`}>
        <h2>File Browser</h2>
      </div>
      {isEmpty(gitRepository) && (
        <CodeViewSyncWithGithub
          onSyncNewGitOrganizationClick={handleAuthWithGitClick}
        />
      )}
      {app.gitRepository && (
        <div>
          <p>connected to: </p>
          {app.gitRepository?.gitOrganization.name}
        </div>
      )}
      <CodeViewExplorer app={app} onFileSelected={onFileSelected} />
    </div>
  );
};

export default CodeViewBar;
