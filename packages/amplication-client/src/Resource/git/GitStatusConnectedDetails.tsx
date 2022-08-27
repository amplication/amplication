import { Button, EnumButtonStyle } from "@amplication/design-system";
import React, { useContext } from "react";
import { AppContext } from "../../context/appContext";

const CLASS_NAME = "git-status-connected-details";

const GitStatusConnectedDetails: React.FC<{}> = () => {
  const { gitRepositoryFullName, gitRepositoryUrl } = useContext(AppContext);
  return (
    <div className={`${CLASS_NAME}`}>
      {gitRepositoryFullName}
      <a href={gitRepositoryUrl} target="github">
        {gitRepositoryFullName.includes("/") && (
          <Button
            buttonStyle={EnumButtonStyle.Text}
            icon="external_link"
            eventData={{
              eventName: "openGithubCodeView",
            }}
          />
        )}
      </a>
    </div>
  );
};

export default GitStatusConnectedDetails;
