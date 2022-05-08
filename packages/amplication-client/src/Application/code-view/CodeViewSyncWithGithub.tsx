import React from "react";
import { Button, EnumButtonStyle } from "@amplication/design-system";
import "./CodeViewSyncWithGithub.scss";
type Props = {
  onSyncNewGitOrganizationClick: (data: any) => any;
};

//const CLASS_NAME = "code-view-sync-with-github";

const CodeViewSyncWithGithub = ({ onSyncNewGitOrganizationClick }: Props) => {
  return (
    <div className="browser-sync">
      <div className="code-view-sync-with-github">
        <p>
          Don't forget to connect to your Github Account to get the full
          experience
        </p>
      </div>
      <br />
      <Button
        buttonStyle={EnumButtonStyle.Secondary}
        icon="github"
        iconSize="xlarge"
        onClick={onSyncNewGitOrganizationClick}
      >
        Sync with GitHub
      </Button>
    </div>
  );
};

export default CodeViewSyncWithGithub;
