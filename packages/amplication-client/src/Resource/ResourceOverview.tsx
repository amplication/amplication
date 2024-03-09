import {
  Button,
  CircleBadge,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  HorizontalRule,
  List,
  Panel,
  SelectMenu,
  SelectMenuList,
  SelectMenuModal,
  Text,
} from "@amplication/ui/design-system";
import { useCallback, useContext, useEffect } from "react";
import PageContent from "../Layout/PageContent";
import { AppContext } from "../context/appContext";
import { resourceThemeMap } from "./constants";
import { useStiggContext } from "@stigg/react-sdk";
import { useSummary } from "./hooks/useSummary";
import { FlexEnd } from "@amplication/ui/design-system/components/FlexItem/FlexItem";
import { Link, useHistory } from "react-router-dom";
import "./ResourceOverview.scss";
import { getGitRepositoryDetails } from "../util/git-repository-details";
import { BtmButton, EnumButtonLocation } from "./break-the-monolith/BtmButton";

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
}> = ({ name, description, link }) => {
  const history = useHistory();
  const handleInstallClick = useCallback(() => {
    history.push(link);
  }, [history]);

  return (
    <div className={`${PAGE_OVERVIEW_CSS}_category`}>
      <div className={`${PAGE_OVERVIEW_CSS}_category_info`}>
        <p className={`${PAGE_OVERVIEW_CSS}_category_name`}>{name}</p>
        <p className={`${PAGE_OVERVIEW_CSS}_category_description`}>
          {description}
        </p>
      </div>
      <Button
        onClick={handleInstallClick}
        buttonStyle={EnumButtonStyle.Outline}
      >
        install
      </Button>
    </div>
  );
};

const AddFunctionalitiesBox: React.FC<{
  icon?: string;
  name: string;
  link: string;
  key?: string;
}> = ({ icon, name, link, key }) => (
  <Link
    key={key}
    to={link}
    className={`${PAGE_OVERVIEW_CSS}_addFunctionalities`}
  >
    <div className={`${PAGE_OVERVIEW_CSS}_addFunctionalities_icon_wrapper`}>
      <Icon icon={icon} size="xsmall" color={EnumTextColor.Black} />
    </div>
    <p className={`${PAGE_OVERVIEW_CSS}_addFunctionalities_name`}>{name}</p>
  </Link>
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
  const {
    currentWorkspace,
    currentProject,
    currentResource,
    projectConfigurationResource,
  } = useContext(AppContext);
  const { refreshData } = useStiggContext();
  const { summaryData, rankedCategories } = useSummary(currentResource);
  const resourceId = currentResource?.id;

  useEffect(() => {
    refreshData();
  }, []);

  const gitRepositoryDetails = getGitRepositoryDetails({
    organization: projectConfigurationResource.gitRepository?.gitOrganization,
    repositoryName: projectConfigurationResource.gitRepository?.name,
    groupName: projectConfigurationResource?.gitRepository?.groupName,
  });

  return (
    <PageContent pageTitle={PAGE_TITLE}>
      <Panel
        panelStyle={EnumPanelStyle.Transparent}
        className={`${PAGE_OVERVIEW_CSS}_buttons_panel`}
      >
        <SelectMenu
          className={`${PAGE_OVERVIEW_CSS}_buttons_panel_select`}
          title="Add functionality"
          buttonStyle={EnumButtonStyle.Primary}
        >
          <SelectMenuModal
            className={`${PAGE_OVERVIEW_CSS}_buttons_panel_modal`}
            align="right"
          >
            <SelectMenuList
              className={`${PAGE_OVERVIEW_CSS}_buttons_panel_list`}
            >
              <p className={`${PAGE_OVERVIEW_CSS}_buttons_panel_list_title`}>
                Functionalities
              </p>
              {rankedCategories.map(({ name }) => (
                <AddFunctionalitiesBox
                  name={name}
                  key={name}
                  link={`/${currentWorkspace.id}/${currentProject.id}/${
                    currentResource.id
                  }/plugins/catalog/${encodeURIComponent(name)}`}
                  icon="database"
                />
              ))}
              <hr className={`${PAGE_OVERVIEW_CSS}_buttons_panel_list_hr`} />
              <Link
                to={`/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/plugins/catalog`}
                className={`${PAGE_OVERVIEW_CSS}_buttons_panel_list_view`}
              >
                <p>View all</p>
                <Icon icon="chevron_right" size="small" />
              </Link>
            </SelectMenuList>
          </SelectMenuModal>
        </SelectMenu>
      </Panel>
      <Panel
        panelStyle={EnumPanelStyle.Bold}
        className={`${PAGE_OVERVIEW_CSS}_resource_panel`}
      >
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
            <div className={`${PAGE_OVERVIEW_CSS}_summary_provider`}>
              <Icon icon="github" size="xsmall" />
              <a target="_blank" href={gitRepositoryDetails.repositoryUrl}>
                {gitRepositoryDetails.repositoryUrl}
              </a>
            </div>
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
            {rankedCategories.map(({ name, description }) => (
              <CategoryBox
                key={name}
                name={name}
                description={description}
                link={`/${currentWorkspace.id}/${currentProject.id}/${
                  currentResource.id
                }/plugins/catalog/${encodeURIComponent(name)}`}
              />
            ))}
          </div>
          <hr className={`${PAGE_OVERVIEW_CSS}_functionalities_hr`} />
          <div
            className={`${PAGE_OVERVIEW_CSS}_functionalities_installed_plugins`}
          >
            {installedPlugins.map(({ name, icon }) => (
              <InstalledPLuginBox key={name} name={name} icon={icon} />
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
