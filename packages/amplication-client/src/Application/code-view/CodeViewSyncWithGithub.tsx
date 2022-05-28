import React from "react";
import { Button, EnumButtonStyle } from "@amplication/design-system";
import "./CodeViewSyncWithGithub.scss";
import { Link } from "react-router-dom";

type Props = {
  appId: string;
};

const CLASS_NAME = "code-view-sync-with-github";

const CodeViewSyncWithGithub = ({ appId }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__message`}>
        Don't forget to connect to your Github Account to get the full
        experience
      </div>
      <Link
          
          title={"Connect to GitHub"}
          to={`/${appId}/github`}
        >
      <Button
        buttonStyle={EnumButtonStyle.Secondary}
        icon="github"
      >
        Sync with GitHub
      </Button>
      </Link>
      <hr />
    </div>
  );
};

export default CodeViewSyncWithGithub;
