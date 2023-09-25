import React, { useContext } from "react";
import { Button, EnumButtonStyle } from "../../Components/Button";
import {
  EnumIconPosition,
  FlexItem,
  Icon,
  Label,
  Tooltip,
  Text,
  EnumTextStyle,
  EnumTextColor,
  EnumFlexItemMargin,
  EnumItemsAlign,
} from "@amplication/ui/design-system";
import { Link } from "react-router-dom";
import * as models from "../../models";
import { isEmpty } from "lodash";
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
            <FlexItem margin={EnumFlexItemMargin.Both}>
              <Text
                textStyle={EnumTextStyle.Tag}
                textColor={EnumTextColor.ThemeOrange}
              >
                Connect to a git provider to create a Pull Request with the
                generated code
              </Text>
            </FlexItem>
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
        <div>
          <FlexItem itemsAlign={EnumItemsAlign.Center}>
            <Text textStyle={EnumTextStyle.Tag}>Connected to:</Text>

            <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
              <GitRepoDetails gitRepositoryFullName={gitRepositoryFullName} />
            </Text>
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
          </FlexItem>
          <FlexItem itemsAlign={EnumItemsAlign.Center}>
            <Text textStyle={EnumTextStyle.Tag}>Last sync:</Text>
            <Tooltip aria-label={`Last sync: ${lastSyncDate}`}>
              <Text
                textStyle={EnumTextStyle.Tag}
                textColor={EnumTextColor.White}
              >
                {lastSyncDate}
              </Text>
            </Tooltip>
          </FlexItem>
        </div>
      )}
    </div>
  );
};

export default AppGitStatusPanel;
