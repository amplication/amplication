import { Button, EnumButtonStyle } from "@amplication/design-system";
import React from "react";

type Props = {
  gitRepositoryFullName: string;
  repoUrl: string;
};

const CLASS_NAME = "git-status-connected-details";

const GitStatusConnectedDetails: React.FC<Props> = ({
  gitRepositoryFullName,
  repoUrl,
}) => {
  return (
    <div className={`${CLASS_NAME}`}>
      {gitRepositoryFullName}
      <a href={repoUrl} target="github">
        <Button
          buttonStyle={EnumButtonStyle.Text}
          icon="external_link"
          eventData={{
            eventName: "openGithubCodeView",
          }}
        />
      </a>
    </div>
  );
};

export default GitStatusConnectedDetails;
