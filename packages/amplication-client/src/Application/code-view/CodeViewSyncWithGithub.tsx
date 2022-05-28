import React from "react";
import { Button, EnumButtonStyle } from "../../Components/Button";
import { Label } from "@amplication/design-system";
import "./CodeViewSyncWithGithub.scss";
import { Link } from "react-router-dom";
import * as models from "../../models";
import { isEmpty } from "lodash";

type Props = {
  app: models.App;
};

const CLASS_NAME = "code-view-sync-with-github";

const CodeViewSyncWithGithub = ({ app }: Props) => {
  const gitRepositoryFullName = `${app.gitRepository?.gitOrganization.name}/${app.gitRepository?.name}`;
  const repoUrl = `https://github.com/${gitRepositoryFullName}`;

  return (
    <div className={CLASS_NAME}>
      {isEmpty(app.gitRepository) ? (
        <>
          <div className={`${CLASS_NAME}__message`}>
            Connect to GitHub to create a Pull Request in your GitHub repository with the generated code
          </div>
          <Link title={"Connect to GitHub"} to={`/${app.id}/github`}>
            <Button buttonStyle={EnumButtonStyle.Secondary} icon="github">
              Connect to GitHub
            </Button>
          </Link>
        </>
      ) : (
        <div className={`${CLASS_NAME}__connected`}>
          <Label text="connected to:" />
          <div className={`${CLASS_NAME}__connected__details`}>
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
        </div>
      )}

      <hr />
    </div>
  );
};

export default CodeViewSyncWithGithub;
