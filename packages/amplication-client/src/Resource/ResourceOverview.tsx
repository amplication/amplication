import { EnumResourceType } from "@amplication/code-gen-types/models";
import {
  Button,
  CircleBadge,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextStyle,
  FlexItem,
  Icon,
  List,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { useContext, useEffect } from "react";
import PageContent from "../Layout/PageContent";
import { AppContext } from "../context/appContext";
// import DocsTile from "./DocsTile";
// import EntitiesTile from "./EntitiesTile";
// import FeatureRequestTile from "./FeatureRequestTile";
// import RolesTile from "./RolesTile";
// import { ServicesTile } from "./ServicesTile";
// import SyncWithGithubTile from "./SyncWithGithubTile";
// import { TopicsTile } from "./TopicsTile";
// import ViewCodeViewTile from "./ViewCodeViewTile";
import { resourceThemeMap } from "./constants";
// import PluginsTile from "./PluginsTile";
import { useStiggContext } from "@stigg/react-sdk";
import { useSummary } from "./hooks/useSummary";
import { FlexEnd } from "@amplication/ui/design-system/components/FlexItem/FlexItem";
import { Link } from "react-router-dom";
import "./ResourceOverview.scss";

const PAGE_TITLE = "Resource Overview";
const PAGE_OVERVIEW_CSS = "resource_overview";

const SummaryBox: React.FC<{
  icon: string;
  title: string;
  link: string;
  value: number;
}> = ({ icon, title, link, value }) => (
  <div>
    <Icon
      className={`${PAGE_OVERVIEW_CSS}_summary_icon`}
      icon={icon}
      size={"small"}
    />
    <span className={`${PAGE_OVERVIEW_CSS}_summary_text`}>{title}</span>
    {value && (
      <Link className={`${PAGE_OVERVIEW_CSS}_summary_link`} to={link}>
        {value}
      </Link>
    )}
  </div>
);

const categories = [
  {
    name: "Message broker",
    description:
      "Connect and manage message queues for efficient data transfer.",
    link: "",
  },
  {
    name: "Message broker",
    description:
      "Connect and manage message queues for efficient data transfer.",
    link: "",
  },
  {
    name: "Message broker",
    description:
      "Connect and manage message queues for efficient data transfer.",
    link: "",
  },
  {
    name: "Message broker",
    description:
      "Connect and manage message queues for efficient data transfer.",
    link: "",
  },
];

const installedPlugins = [
  {
    icon: "database",
    name: "Database",
  },
  {
    icon: "database",
    name: "Auth",
  },
  {
    icon: "database",
    name: "Secret management",
  },
];

const CategoryBox: React.FC<{
  name: string;
  description: string;
  link: string;
}> = ({ name, description, link }) => (
  <div className={`${PAGE_OVERVIEW_CSS}_category`}>
    <div className={`${PAGE_OVERVIEW_CSS}_category_info`}>
      <p className={`${PAGE_OVERVIEW_CSS}_category_name`}>{name}</p>
      <p className={`${PAGE_OVERVIEW_CSS}_category_description`}>
        {description}
      </p>
    </div>
    <Button buttonStyle={EnumButtonStyle.Outline}>install</Button>
  </div>
);

const InstalledPLuginBox: React.FC<{
  name: string;
  icon: string;
}> = ({ name, icon }) => (
  <div className={`${PAGE_OVERVIEW_CSS}_installed_plugin`}>
    <div className={`${PAGE_OVERVIEW_CSS}_installed_plugin_dot`}></div>
    <Icon icon={icon} size="xsmall" />
    <p className={`${PAGE_OVERVIEW_CSS}_installed_plugin_name`}>{name}</p>
  </div>
);

const EssentialBox: React.FC<{
  isBorder: boolean;
  borderColor?: string;
  icon: string;
  title: string;
  link: string;
  value?: number;
  description: string;
}> = ({ isBorder, borderColor, icon, title, link, value, description }) => (
  <div className={`${PAGE_OVERVIEW_CSS}_essential_wrapper`}>
    {isBorder && (
      <div
        className={`${PAGE_OVERVIEW_CSS}_essential_border ${PAGE_OVERVIEW_CSS}${borderColor}`}
      ></div>
    )}
    <div className={`${PAGE_OVERVIEW_CSS}_essential_info`}>
      <SummaryBox icon={icon} title={title} link={link} value={value} />
      <p className={`${PAGE_OVERVIEW_CSS}_essential_text`}>{description}</p>
    </div>
    <Link className={`${PAGE_OVERVIEW_CSS}_essential_link`} to={link}>
      <Icon icon="chevron_right" size="small" />
    </Link>
  </div>
);

const ResourceOverview = () => {
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);
  const { refreshData } = useStiggContext();
  const { summaryData } = useSummary(currentResource);
  const resourceId = currentResource?.id;

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <PageContent pageTitle={PAGE_TITLE}>
      <Panel
        panelStyle={EnumPanelStyle.Bold}
        className={`${PAGE_OVERVIEW_CSS}_resource_panel`}
      >
        <FlexItem
          direction={EnumFlexDirection.Row}
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
          <FlexEnd className={`${PAGE_OVERVIEW_CSS}_summary_wrapper`}>
            <SummaryBox
              icon="database"
              title="Data Models"
              link={`/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/entities`}
              value={summaryData.models}
            />
            <SummaryBox
              icon="api"
              title="APIs"
              link={`/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/modules/all`}
              value={summaryData.apis}
            />
            <SummaryBox
              icon="plugin"
              title="Installed Plugins"
              link={`/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/plugins/installed`}
              value={summaryData.installedPlugins}
            />
            <SummaryBox
              icon="roles"
              title="Roles"
              link={`/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/roles`}
              value={summaryData.roles}
            />
          </FlexEnd>
        </FlexItem>
      </Panel>
      <div className={`${PAGE_OVERVIEW_CSS}_essential`}>
        <p className={`${PAGE_OVERVIEW_CSS}_essential_section_title`}>
          Essential links
        </p>
        <div className={`${PAGE_OVERVIEW_CSS}_essential_sections`}>
          <EssentialBox
            isBorder={true}
            borderColor="_essential_pink"
            icon="database"
            title="Data Models"
            value={summaryData.models}
            description="Use Amplication's simple and intuitive user interface to define
            your data model."
            link={`/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/entities`}
          />
          <EssentialBox
            isBorder={true}
            borderColor="_essential_blue"
            icon="api"
            title="APIs"
            value={summaryData.apis}
            description="Utilize a simple interface to manage and interact with your
            application's API."
            link={`/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/modules/all`}
          />
        </div>
      </div>
      <div>
        <p className={`${PAGE_OVERVIEW_CSS}_essential_section_title`}>
          Functionalities
        </p>
        <div className={`${PAGE_OVERVIEW_CSS}_functionalities`}>
          <div className={`${PAGE_OVERVIEW_CSS}_functionalities_border`} />
          <div
            className={`${PAGE_OVERVIEW_CSS}_functionalities_plugins_categories`}
          >
            {categories.map(({ name, description, link }) => (
              <CategoryBox name={name} description={description} link={link} />
            ))}
          </div>
          <hr className={`${PAGE_OVERVIEW_CSS}_functionalities_hr`} />
          <div
            className={`${PAGE_OVERVIEW_CSS}_functionalities_installed_plugins`}
          >
            {installedPlugins.map(({ name, icon }) => (
              <InstalledPLuginBox name={name} icon={icon} />
            ))}
            <div
              className={`${PAGE_OVERVIEW_CSS}_functionalities_installed_plugins_view`}
            >
              <p>More Functionalities</p>
              <Link
                className={`${PAGE_OVERVIEW_CSS}_functionalities_installed_plugins_link`}
                to={`/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/plugins/catalog`}
              >
                View now
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p className={`${PAGE_OVERVIEW_CSS}_essential_section_title`}>
          Essential links
        </p>
        <div className={`${PAGE_OVERVIEW_CSS}_essential_links`}>
          <EssentialBox
            isBorder={false}
            icon="plugin"
            title="Installed plugins"
            value={summaryData.installedPlugins}
            description="Extend and customize your services by using plugins for various technologies and integrations"
            link={`/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/plugins/installed`}
          />
          <EssentialBox
            isBorder={false}
            icon="roles"
            title="Roles"
            value={summaryData.roles}
            description="Create roles and define permissions. Whether at the Entity level or the Field level, granularity is key."
            link={`/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/roles`}
          />
          <EssentialBox
            isBorder={false}
            icon="file"
            title="Read the Docs"
            description="When in doubt, read the docs. You’ll become an expert in no time."
            link={`https://docs.amplication.com/`}
          />
        </div>
      </div>
    </PageContent>
  );
};

export default ResourceOverview;
