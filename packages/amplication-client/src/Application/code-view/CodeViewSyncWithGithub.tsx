import React from "react";
import { Button, EnumButtonStyle } from "@amplication/design-system";
import "./CodeViewSyncWithGithub.scss";

type Props = {
  onSyncNewGitOrganizationClick: (data: any) => any;
};

const CLASS_NAME = "code-view-sync-with-github";

const CodeViewSyncWithGithub = ({ onSyncNewGitOrganizationClick }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__message`}>
        Don't forget to connect to your Github Account to get the full
        experience
      </div>
      <Button
        buttonStyle={EnumButtonStyle.Secondary}
        icon="github"
        onClick={onSyncNewGitOrganizationClick}
      >
        Sync with GitHub
      </Button>
      <hr />
    </div>
  );
};

export default CodeViewSyncWithGithub;
