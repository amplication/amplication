import React from "react";
import { Button, EnumButtonStyle } from "../../Components/Button";
import { Icon, Label, Tooltip } from "@amplication/design-system";
import { Link } from "react-router-dom";
import * as models from "../../models";
import { isEmpty } from "lodash";
import "./AppGitStatusPanel.scss";
import { format } from "date-fns";

type Props = {
  app: models.App;
};

const CLASS_NAME = "app-git-status-panel";
const DATE_FORMAT = "PP p";

const AppGitStatusPanel = ({ app }: Props) => {
  const gitRepositoryFullName = `${app.gitRepository?.gitOrganization.name}/${app.gitRepository?.name}`;
  const repoUrl = `https://github.com/${gitRepositoryFullName}`;

  const lastSync = app.githubLastSync;

  return (
    <div className={CLASS_NAME}>
      {isEmpty(app.gitRepository) ? (
        <>
          <div className={`${CLASS_NAME}__message`}>
            Connect to GitHub to create a Pull Request in your GitHub repository
            with the generated code
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
          {lastSync && (
            <div className={`${CLASS_NAME}__last-sync`}>
              <Icon icon="clock" />
              <Tooltip
                aria-label={`Last sync: ${format(lastSync, DATE_FORMAT)}`}
              >
                <span>Last sync </span>
                {format(lastSync, DATE_FORMAT)}
              </Tooltip>
            </div>
          )}
        </div>
      )}

      <hr />
    </div>
  );
};

export default AppGitStatusPanel;
