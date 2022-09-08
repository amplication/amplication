import React, { useContext } from "react";
import { Button, EnumButtonStyle } from "../../Components/Button";
import {
  EnumIconPosition,
  Icon,
  Label,
  Tooltip,
} from "@amplication/design-system";
import { Link } from "react-router-dom";
import * as models from "../../models";
import { isEmpty } from "lodash";
import "./AppGitStatusPanel.scss";
import { format } from "date-fns";
import { AppContext } from "../../context/appContext";
import GitRepoDetails from "./GitRepoDetails";

type Props = {
  resource: models.Resource | null;
  showDisconnectedMessage: boolean;
};

const CLASS_NAME = "app-git-status-panel";
const DATE_FORMAT = "PP p";

const AppGitStatusPanel = ({ resource, showDisconnectedMessage }: Props) => {
  const { currentWorkspace, currentProject, gitRepositoryUrl } = useContext(
    AppContext
  );

  const lastSync = new Date(resource?.githubLastSync);

  return (
    <div className={CLASS_NAME}>
      {isEmpty(resource?.gitRepository) ? (
        <>
          {showDisconnectedMessage && (
            <div className={`${CLASS_NAME}__message`}>
              Connect to GitHub to create a Pull Request with the generated code
            </div>
          )}
          <Link
            title={"Connect to GitHub"}
            to={`/${currentWorkspace?.id}/${currentProject?.id}/${resource?.id}/github`}
          >
            <Button
              buttonStyle={EnumButtonStyle.Secondary}
              icon="github"
              iconPosition={EnumIconPosition.Left}
              className={`${CLASS_NAME}__connect__button`}
            >
              Connect to GitHub
            </Button>
          </Link>
        </>
      ) : (
        <div className={`${CLASS_NAME}__connected`}>
          <Label text="connected to:" />
          <div className={`${CLASS_NAME}__connected__details`}>
            <GitRepoDetails />
            <a
              className={`${CLASS_NAME}__gh-link`}
              href={gitRepositoryUrl}
              target="github"
            >
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
    </div>
  );
};

export default AppGitStatusPanel;
