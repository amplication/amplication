import { EnumResourceType } from "@amplication/code-gen-types";
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
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { useStiggContext } from "@stigg/react-sdk";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import PageContent from "../Layout/PageContent";
import { useAppContext } from "../context/appContext";
import APIsTile from "./APIsTile";
import AddResourceFunctionalityButton from "./AddResourceFunctionalityButton";
import EntitiesTile from "./EntitiesTile";
import { PluginsTile } from "./PluginsTile";
import "./ResourceOverview.scss";
import { ServicesTile } from "./ServicesTile";
import { TopicsTile } from "./TopicsTile";
import { resourceThemeMap } from "./constants";
import AppGitStatusPanel from "./git/AppGitStatusPanel";
import { useResourceSummary } from "./hooks/useResourceSummary";
import { CodeGeneratorImage } from "../Components/CodeGeneratorImage";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";

const PAGE_TITLE = "Resource Overview";

type UsageDataItem = {
  icon: string;
  title: string;
  link: string;
  value: number;
};

const CLASS_NAME = "resource-overview";

const ResourceOverview = () => {
  const { currentResource } = useAppContext();
  const { refreshData } = useStiggContext();
  const { baseUrl } = useResourceBaseUrl();

  const {
    summaryData,
    usedCategories,
    availableCategories,
    pluginsDataLoading,
  } = useResourceSummary(currentResource);

  const resourceId = currentResource?.id;

  const resourceUsageData = useMemo((): UsageDataItem[] => {
    return [
      {
        icon: "database",
        title: "Entities",
        link: `${baseUrl}/entities`,
        value: summaryData.models,
      },
      {
        icon: "api",
        title: "APIs",
        link: `${baseUrl}/modules`,
        value: summaryData.apis,
      },
      {
        icon: "plugin",
        title: "Installed Plugins",
        link: `${baseUrl}/plugins/installed`,
        value: summaryData.installedPlugins,
      },
      {
        icon: "roles_outline",
        title: "Roles",
        link: `${baseUrl}/roles`,
        value: summaryData.roles,
      },
    ];
  }, [baseUrl, summaryData]);

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <PageContent pageTitle={PAGE_TITLE}>
      <FlexItem>
        <FlexItem.FlexEnd direction={EnumFlexDirection.Row}>
          {currentResource?.resourceType === EnumResourceType.Service ||
            (currentResource?.resourceType ===
              EnumResourceType.ServiceTemplate && (
              <AddResourceFunctionalityButton
                availableCategories={availableCategories}
              />
            ))}
        </FlexItem.FlexEnd>
      </FlexItem>

      <HorizontalRule doubleSpacing />

      <Panel panelStyle={EnumPanelStyle.Bold}>
        <FlexItem itemsAlign={EnumItemsAlign.Center}>
          <FlexItem.FlexStart direction={EnumFlexDirection.Column}>
            <FlexItem
              direction={EnumFlexDirection.Row}
              gap={EnumGapSize.Small}
              itemsAlign={EnumItemsAlign.Center}
            >
              <CircleBadge
                size="large"
                name={currentResource?.name || ""}
                color={
                  resourceThemeMap[currentResource?.resourceType].color ||
                  "transparent"
                }
              />
              <CodeGeneratorImage resource={currentResource} size="medium" />
            </FlexItem>
            <Text textStyle={EnumTextStyle.H3}>{currentResource?.name}</Text>
            <Text textStyle={EnumTextStyle.Description}>
              {currentResource?.description}
            </Text>
            {currentResource?.resourceType === EnumResourceType.Service && (
              <AppGitStatusPanel resource={currentResource} />
            )}
          </FlexItem.FlexStart>
          {currentResource?.resourceType === EnumResourceType.Service && (
            <FlexItem.FlexEnd>
              {resourceUsageData.map((item) => (
                <Link to={item.link} key={item.title}>
                  <FlexItem
                    direction={EnumFlexDirection.Row}
                    gap={EnumGapSize.Default}
                    itemsAlign={EnumItemsAlign.Center}
                  >
                    <Icon
                      color={EnumTextColor.White}
                      icon={item.icon}
                      size={"small"}
                    />
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
          )}
        </FlexItem>
      </Panel>

      {currentResource?.resourceType === EnumResourceType.ServiceTemplate && (
        <>
          {!pluginsDataLoading && (
            <PluginsTile
              usedCategories={usedCategories}
              availableCategories={availableCategories}
            />
          )}
        </>
      )}

      {currentResource?.resourceType === EnumResourceType.Service && (
        <>
          <div className={`${CLASS_NAME}__split`}>
            <EntitiesTile resourceId={resourceId} />
            <APIsTile resourceId={resourceId} />
          </div>
          {!pluginsDataLoading && (
            <PluginsTile
              usedCategories={usedCategories}
              availableCategories={availableCategories}
            />
          )}
        </>
      )}

      {currentResource?.resourceType === EnumResourceType.MessageBroker && (
        <div className={`${CLASS_NAME}__split`}>
          <TopicsTile resourceId={resourceId} />

          <ServicesTile resourceId={resourceId} />
        </div>
      )}
    </PageContent>
  );
};

export default ResourceOverview;
