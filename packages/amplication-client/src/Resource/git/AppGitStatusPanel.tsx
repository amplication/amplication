import React, { useContext } from "react";
import { Button, EnumButtonStyle } from "../../Components/Button";
import {
  EnumIconPosition,
  Icon,
  Label,
  Tooltip,
} from "@amplication/ui/design-system";
import { Link } from "react-router-dom";
import * as models from "../../models";
import { isEmpty } from "lodash";
import "./AppGitStatusPanel.scss";
import { format } from "date-fns";
import { AppContext } from "../../context/appContext";
import GitRepoDetails from "./GitRepoDetails";
import { AnalyticsEventNames } from "../../util/analytics-events.types";

type Props = {
  resource: models.Resource | null;
  showDisconnectedMessage: boolean;
};

const CLASS_NAME = "app-git-status-panel";
const DATE_FORMAT = "PP p";

const AppGitStatusPanel = ({ resource, showDisconnectedMessage }: Props) => {
  const {
    currentWorkspace,
    currentProject,
    gitRepositoryUrl,
    gitRepositoryFullName,
    gitRepositoryOrganizationProvider,
  } = useContext(AppContext);

  const lastSync = resource?.githubLastSync
    ? new Date(resource.githubLastSync)
    : null;

  const lastSyncDate = lastSync ? format(lastSync, DATE_FORMAT) : "Never";

  return (
    <div className={CLASS_NAME}>
      {isEmpty(resource?.gitRepository) ? (
        <>
          {showDisconnectedMessage && (
            <div className={`${CLASS_NAME}__message`}>
              Connect to a git provider to create a Pull Request with the
              generated code
            </div>
          )}
          <Link
            title={"Connect to a git provider"}
            to={`/${currentWorkspace?.id}/${currentProject?.id}/${resource?.id}/git-sync`}
          >
            <Button
              buttonStyle={EnumButtonStyle.Secondary}
              icon="pending_changes"
              iconPosition={EnumIconPosition.Left}
              className={`${CLASS_NAME}__connect__button`}
            >
              Connect with a git provider
            </Button>
          </Link>
        </>
      ) : (
        <div className={`${CLASS_NAME}__connected`}>
          <Label text="connected to:" />
          <div className={`${CLASS_NAME}__connected__details`}>
            <GitRepoDetails gitRepositoryFullName={gitRepositoryFullName} />
            <a
              className={`${CLASS_NAME}__git-link`}
              href={gitRepositoryUrl}
              target={
                gitRepositoryOrganizationProvider?.toLocaleLowerCase() ||
                "_blank"
              }
              rel="noreferrer"
            >
              <Button
                buttonStyle={EnumButtonStyle.Text}
                icon="external_link"
                eventData={{
                  eventName: AnalyticsEventNames.GithubCodeViewClick,
                }}
              />
            </a>
          </div>
          <div className={`${CLASS_NAME}__last-sync`}>
            <Icon icon="clock" />
            <Tooltip aria-label={`Last sync: ${lastSyncDate}`}>
              <span>Last sync </span>
              {lastSyncDate}
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppGitStatusPanel;
