import { EnumResourceType } from "@amplication/code-gen-types/models";
import {
  CircleBadge,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Icon,
  List,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { useContext, useEffect, useMemo } from "react";
import PageContent from "../Layout/PageContent";
import { AppContext, useAppContext } from "../context/appContext";
import DocsTile from "./DocsTile";
import EntitiesTile from "./EntitiesTile";
import FeatureRequestTile from "./FeatureRequestTile";
import RolesTile from "./RolesTile";
import { ServicesTile } from "./ServicesTile";
import SyncWithGithubTile from "./SyncWithGithubTile";
import { TopicsTile } from "./TopicsTile";
import ViewCodeViewTile from "./ViewCodeViewTile";
import { resourceThemeMap } from "./constants";
import PluginsTile from "./PluginsTile";
import { useStiggContext } from "@stigg/react-sdk";
import { BtmButton, EnumButtonLocation } from "./break-the-monolith/BtmButton";
import { useResourceSummary } from "./hooks/useResourceSummary";
import { Link } from "react-router-dom";

const PAGE_TITLE = "Resource Overview";

type usageDataItem = {
  icon: string;
  title: string;
  link: string;
  value: number;
};

const ResourceOverview = () => {
  const { currentResource, currentProject, currentWorkspace } = useAppContext();
  const { refreshData } = useStiggContext();

  const { summaryData, rankedCategories } = useResourceSummary(currentResource);

  const resourceId = currentResource?.id;

  const resourceUsageData = useMemo((): usageDataItem[] => {
    return [
      {
        icon: "database",
        title: "Data Models",
        link: `/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/entities`,
        value: summaryData.models,
      },
      {
        icon: "api",
        title: "APIs",
        link: `/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/modules/all`,
        value: summaryData.apis,
      },
      {
        icon: "plugin",
        title: "Installed Plugins",
        link: `/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/plugins/installed`,
        value: summaryData.installedPlugins,
      },
      {
        icon: "roles_outline",
        title: "Roles",
        link: `/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/roles`,
        value: summaryData.roles,
      },
    ];
  }, [currentProject.id, currentResource, currentWorkspace, summaryData]);

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <PageContent pageTitle={PAGE_TITLE}>
      <FlexItem>
        <FlexItem.FlexEnd>
          <BtmButton
            openInFullScreen
            location={EnumButtonLocation.Resource}
            ButtonStyle={EnumButtonStyle.GradientFull}
          />
        </FlexItem.FlexEnd>
      </FlexItem>

      <HorizontalRule doubleSpacing />

      <Panel panelStyle={EnumPanelStyle.Bold}>
        <FlexItem
          itemsAlign={EnumItemsAlign.Center}
          start={
            <CircleBadge
              name={currentResource?.name || ""}
              color={
                resourceThemeMap[currentResource?.resourceType].color ||
                "transparent"
              }
            />
          }
        >
          <FlexItem
            direction={EnumFlexDirection.Column}
            gap={EnumGapSize.Small}
          >
            <Text textStyle={EnumTextStyle.H3}>{currentResource?.name}</Text>
            <Text textStyle={EnumTextStyle.Description}>
              {currentResource?.description}
            </Text>
          </FlexItem>
          <FlexItem.FlexEnd>
            {resourceUsageData.map((item) => (
              <Link to={item.link} key={item.title}>
                <FlexItem
                  direction={EnumFlexDirection.Row}
                  gap={EnumGapSize.Default}
                  itemsAlign={EnumItemsAlign.Center}
                >
                  <Icon icon={item.icon} size={"small"} />
                  <Text
                    textStyle={EnumTextStyle.Tag}
                    textColor={EnumTextColor.White}
                  >
                    {item.title}
                  </Text>
                  {item.value && (
                    <Text
                      textStyle={EnumTextStyle.Tag}
                      textColor={EnumTextColor.ThemeTurquoise}
                    >
                      {item.value}
                    </Text>
                  )}
                </FlexItem>
              </Link>
            ))}
          </FlexItem.FlexEnd>
        </FlexItem>
      </Panel>

      <List>
        <SyncWithGithubTile resourceId={resourceId} />
        {currentResource?.resourceType === EnumResourceType.Service && (
          <>
            <EntitiesTile resourceId={resourceId} />
            <PluginsTile resourceId={resourceId} />

            <RolesTile resourceId={resourceId} />
          </>
        )}
        {currentResource?.resourceType === EnumResourceType.MessageBroker && (
          <>
            <TopicsTile resourceId={resourceId} />

            <ServicesTile resourceId={resourceId} />
          </>
        )}
        <ViewCodeViewTile resourceId={resourceId} />

        <DocsTile />
        <FeatureRequestTile />
      </List>
    </PageContent>
  );
};

export default ResourceOverview;
