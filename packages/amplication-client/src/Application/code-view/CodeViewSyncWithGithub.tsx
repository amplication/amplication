import React from "react";
import { Button, EnumButtonStyle } from "@amplication/design-system";

type Props = {
  onSyncNewGitOrganizationClick: (data: any) => any;
};

const CLASS_NAME = "code-view-sync-with-github";

const CodeViewSyncWithGithub = ({ onSyncNewGitOrganizationClick }: Props) => {
  return (
    <div>
      <div className={CLASS_NAME}>
        Don't forget to connect to your Github Account to get the full
        experience
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
