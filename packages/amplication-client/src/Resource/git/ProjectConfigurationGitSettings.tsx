import {
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  Panel,
  TabContentTitle,
  Text,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/appContext";
import ResourceGitSyncDetails from "./GitActions/RepositoryActions/ResourceGitSyncDetails";
import { useProjectBaseUrl } from "../../util/useProjectBaseUrl";

type Props = {
  isOverride: boolean;
  showProjectSettingsLink?: boolean;
};

const ProjectConfigurationGitSettings: React.FC<Props> = ({
  isOverride,
  showProjectSettingsLink = true,
}) => {
  const { currentWorkspace, projectConfigurationResource } =
    useContext(AppContext);

  const { baseUrl } = useProjectBaseUrl({ overrideIsPlatformConsole: false });

  const gitOrganizations = currentWorkspace?.gitOrganizations;

  return (
    <>
      <TabContentTitle title="Default Project Settings" />

      <Panel
        panelStyle={isOverride ? EnumPanelStyle.Default : EnumPanelStyle.Bold}
      >
        <FlexItem
          end={
            showProjectSettingsLink && (
              <Link title={"Go to project settings"} to={`${baseUrl}/git-sync`}>
                <Text
                  textStyle={EnumTextStyle.Normal}
                  textColor={EnumTextColor.ThemeTurquoise}
                  underline={true}
                >
                  Go to project settings
                </Text>
              </Link>
            )
          }
        >
          {projectConfigurationResource?.gitRepository && (
            <>
              <ResourceGitSyncDetails
                showGitRepositoryBtn={false}
                resourceWithRepository={projectConfigurationResource}
              />
            </>
          )}
          {isEmpty(gitOrganizations) && (
            <FlexItem itemsAlign={EnumItemsAlign.Center}>
              <Icon icon="info_circle" />
              <Text>No organization was selected</Text>
            </FlexItem>
          )}
          {!isEmpty(gitOrganizations) &&
            isEmpty(projectConfigurationResource?.gitRepository) && (
              <FlexItem itemsAlign={EnumItemsAlign.Center}>
                <Icon icon="info_circle" />
                <Text>No repository was selected</Text>
              </FlexItem>
            )}
        </FlexItem>
      </Panel>
    </>
  );
};

export default ProjectConfigurationGitSettings;
