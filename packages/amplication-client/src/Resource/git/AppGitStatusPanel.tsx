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
import GitStatusConnectedDetails from "./GitStatusConnectedDetails";

type Props = {
  resource: models.Resource | null;
  showDisconnectedMessage: boolean;
};

const CLASS_NAME = "app-git-status-panel";
const DATE_FORMAT = "PP p";

const AppGitStatusPanel = ({ resource, showDisconnectedMessage }: Props) => {
  const gitRepositoryFullName = `${resource?.gitRepository?.gitOrganization.name}/${resource?.gitRepository?.name}`;

  const repoUrl = `https://github.com/${gitRepositoryFullName}`;

  const { currentWorkspace, currentProject } = useContext(AppContext);

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
            <GitStatusConnectedDetails
              gitRepositoryFullName={gitRepositoryFullName}
              repoUrl={repoUrl}
            />
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
