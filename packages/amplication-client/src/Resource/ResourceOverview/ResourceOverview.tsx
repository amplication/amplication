import { EnumResourceType } from "@amplication/code-gen-types";
import {
  EnumContentAlign,
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
  VersionTag,
} from "@amplication/ui/design-system";
import { useStiggContext } from "@stigg/react-sdk";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { CodeGeneratorImage } from "../../Components/CodeGeneratorImage";
import ResourceTypeBadge from "../../Components/ResourceTypeBadge";
import ResourcePropertiesBlock from "../../CustomProperties/ResourcePropertiesBlock";
import PageContent from "../../Layout/PageContent";
import ResourceRelations from "../../Relation/ResourceRelations";
import { useAppContext } from "../../context/appContext";
import { useResourceBaseUrl } from "../../util/useResourceBaseUrl";
import APIsTile from "../APIsTile";
import AddResourceFunctionalityButton from "../AddResourceFunctionalityButton";
import EntitiesTile from "../EntitiesTile";
import { PluginsTile } from "../PluginsTile";
import { ServicesTile } from "../ServicesTile";
import { TopicsTile } from "../TopicsTile";
import ResourceGitStatusPanel from "../git/ResourceGitStatusPanel";
import { useResourceSummary } from "../hooks/useResourceSummary";
import "./ResourceOverview.scss";

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
              <ResourceTypeBadge resource={currentResource} size="large" />

              <CodeGeneratorImage resource={currentResource} size="medium" />
            </FlexItem>
            <Text textStyle={EnumTextStyle.H3}>{currentResource?.name}</Text>
            <Text textStyle={EnumTextStyle.Description}>
              {currentResource?.description}
            </Text>

            {currentResource?.resourceType === EnumResourceType.Service && (
              <ResourceGitStatusPanel resource={currentResource} />
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
          {currentResource?.resourceType ===
            EnumResourceType.ServiceTemplate && (
            <FlexItem.FlexEnd alignSelf={EnumContentAlign.Start}>
              <VersionTag version={currentResource.version?.version} />
            </FlexItem.FlexEnd>
          )}
        </FlexItem>
      </Panel>

      <Panel panelStyle={EnumPanelStyle.Bordered}>
        <ResourcePropertiesBlock resource={currentResource} />
      </Panel>
      {currentResource?.resourceType !== EnumResourceType.ServiceTemplate && (
        <ResourceRelations />
      )}

      {currentResource?.resourceType === EnumResourceType.ServiceTemplate &&
        !currentResource.blueprintId && (
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
