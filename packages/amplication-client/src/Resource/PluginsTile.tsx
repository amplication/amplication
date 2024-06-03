import {
  EnabledIndicator,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumListStyle,
  EnumPanelStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Icon,
  List,
  ListItem,
  Panel,
  Text,
  Tooltip,
} from "@amplication/ui/design-system";
import { useCallback, useMemo } from "react";
import "./PluginsTile.scss";
import {
  PluginCategory,
  usedPluginCategories,
} from "./hooks/useResourceSummary";
import usePlugins, {
  SortedPluginInstallation,
} from "../Plugins/hooks/usePlugins";
import { useAppContext } from "../context/appContext";
import { PluginLogo } from "../Plugins/PluginLogo";
import { TitleAndIcon } from "../Components/TitleAndIcon";
import { Link } from "react-router-dom";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { useTracking } from "../util/analytics";

type Props = {
  usedCategories: usedPluginCategories;
  availableCategories: PluginCategory[];
};

const CLASS_NAME = "plugins-tile";
const PLUGIN_LOGOS_CLASS_NAME = "plugin-logos";
const TOOLTIP_DIRECTION = "n";

const AVAILABLE_CATEGORIES = "AvailableCategories";
const INSTALLED_CATEGORIES = "InstalledCategories";

function PluginsTile({ usedCategories, availableCategories }: Props) {
  const { currentWorkspace, currentProject, currentResource } = useAppContext();
  const { trackEvent } = useTracking();

  const catalogUrl = `/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/plugins/catalog`;
  const installedUrl = `/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/plugins/installed`;

  const installedCategories = useMemo(() => {
    if (!usedCategories) {
      return [];
    }

    const usedCategoriesList = Object.values(usedCategories)
      .map((category) => category.category)
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 4);

    return usedCategoriesList.map((category) => {
      const usedCategory = usedCategories[category.name];
      return {
        category,
        installedPlugins: usedCategory?.installedPlugin || [],
      };
    });
  }, [usedCategories]);

  const handleCategoryClick = useCallback(
    (location: string, category: PluginCategory) => {
      trackEvent({
        eventName: AnalyticsEventNames.PluginCategoryTileClick,
        location,
        category: category.name,
      });
    },
    [trackEvent]
  );

  const availableCategoriesList = availableCategories.slice(0, 4);

  return (
    <Panel
      panelStyle={EnumPanelStyle.Bordered}
      themeColor={EnumTextColor.ThemeTurquoise}
    >
      <FlexItem
        itemsAlign={EnumItemsAlign.Start}
        gap={EnumGapSize.Default}
        margin={EnumFlexItemMargin.Bottom}
        direction={EnumFlexDirection.Column}
      >
        <TitleAndIcon icon={"plugin"} title={"Plugins"} />

        <Text textStyle={EnumTextStyle.Subtle}>
          Enhance your service with additional functionality and accelerate
          development with Amplication's wide range of plugins and integrations.
        </Text>
      </FlexItem>
      {availableCategoriesList && availableCategoriesList.length > 0 && (
        <>
          <HorizontalRule />
          <FlexItem
            margin={EnumFlexItemMargin.Both}
            itemsAlign={EnumItemsAlign.Center}
          >
            <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
              Available Plugins
            </Text>
            <FlexItem.FlexEnd>
              <Link to={catalogUrl}>
                <Text
                  textStyle={EnumTextStyle.Subtle}
                  textColor={EnumTextColor.ThemeTurquoise}
                >
                  Check the full catalog
                </Text>
              </Link>
            </FlexItem.FlexEnd>
          </FlexItem>

          <div className={CLASS_NAME}>
            {availableCategoriesList.map((category) => (
              <AvailableCategory
                key={category.name}
                category={category}
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        </>
      )}
      <HorizontalRule />
      <FlexItem
        margin={EnumFlexItemMargin.Both}
        itemsAlign={EnumItemsAlign.Center}
      >
        <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
          Installed Plugins
        </Text>
        <FlexItem.FlexEnd>
          <Link to={installedUrl}>
            <Text
              textStyle={EnumTextStyle.Subtle}
              textColor={EnumTextColor.ThemeTurquoise}
            >
              Manage installed plugins
            </Text>
          </Link>
        </FlexItem.FlexEnd>
      </FlexItem>

      <div className={CLASS_NAME}>
        {installedCategories.map((category) => (
          <InstalledCategory
            key={category.category.name}
            {...category}
            onClick={handleCategoryClick}
          />
        ))}
      </div>
    </Panel>
  );
}

type AvailableCategoryProps = {
  category: PluginCategory;
  onClick?: (location: string, category: PluginCategory) => void;
};
function AvailableCategory({ category, onClick }: AvailableCategoryProps) {
  const { currentWorkspace, currentProject, currentResource } = useAppContext();

  const url = `/${currentWorkspace.id}/${currentProject.id}/${
    currentResource.id
  }/plugins/catalog/${encodeURIComponent(category.name)}`;

  return (
    <List listStyle={EnumListStyle.Dark}>
      <ListItem
        to={url}
        onClick={() => onClick(AVAILABLE_CATEGORIES, category)}
        direction={EnumFlexDirection.Column}
        gap={EnumGapSize.Large}
        end={
          <Text
            textStyle={EnumTextStyle.Tag}
            textColor={EnumTextColor.ThemeTurquoise}
          >
            Try out
          </Text>
        }
      >
        <TitleAndIcon icon={category.icon} title={category.name} />
        <Text
          className={`${CLASS_NAME}__description`}
          textStyle={EnumTextStyle.Subtle}
        >
          {category.description}
        </Text>
      </ListItem>
    </List>
  );
}

type InstalledCategoryProps = {
  category: PluginCategory;
  installedPlugins: SortedPluginInstallation[];
  onClick?: (location: string, category: PluginCategory) => void;
};
function InstalledCategory({
  category,
  installedPlugins,
  onClick,
}: InstalledCategoryProps) {
  const { currentWorkspace, currentProject, currentResource } = useAppContext();

  const url = `/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/plugins/installed`;

  return (
    <List listStyle={EnumListStyle.Default}>
      <ListItem
        to={url}
        onClick={() => {
          onClick(INSTALLED_CATEGORIES, category);
        }}
        direction={EnumFlexDirection.Column}
        gap={EnumGapSize.Large}
        end={<PluginLogos installedPlugins={installedPlugins} />}
      >
        <FlexItem itemsAlign={EnumItemsAlign.Center} gap={EnumGapSize.Small}>
          <EnabledIndicator enabled={true} />
          <TitleAndIcon icon={category.icon} title={category.name} />
        </FlexItem>
      </ListItem>
    </List>
  );
}

type pluginLogosProps = {
  installedPlugins: SortedPluginInstallation[];
};
function PluginLogos({ installedPlugins }: pluginLogosProps) {
  const { currentResource } = useAppContext();
  const { pluginCatalog } = usePlugins(
    currentResource?.id,
    null,
    currentResource?.codeGenerator
  );

  const firstPlugins = installedPlugins.slice(0, 4);
  const restPlugins = installedPlugins.slice(4);

  return (
    <div className={PLUGIN_LOGOS_CLASS_NAME}>
      {firstPlugins.map((plugin) => (
        <Tooltip
          wrap
          direction={TOOLTIP_DIRECTION}
          aria-label={plugin.displayName}
          noDelay
          key={plugin.id}
        >
          <PluginLogo plugin={pluginCatalog[plugin.pluginId]} />
        </Tooltip>
      ))}
      {restPlugins.length > 0 && (
        <Tooltip
          wrap
          direction={TOOLTIP_DIRECTION}
          aria-label={restPlugins
            .map((plugin) => plugin.displayName)
            .join(", ")}
          noDelay
        >
          <div className={`${PLUGIN_LOGOS_CLASS_NAME}__more-plugins`}>
            <Text
              textStyle={EnumTextStyle.Subtle}
              textColor={EnumTextColor.White}
            >
              +{restPlugins.length}
            </Text>
          </div>
        </Tooltip>
      )}
    </div>
  );
}

export { PluginsTile };
