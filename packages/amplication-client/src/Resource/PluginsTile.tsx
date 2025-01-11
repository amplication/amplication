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
  List,
  ListItem,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { TitleAndIcon } from "../Components/TitleAndIcon";
import PluginLogoGroup from "../Plugins/PluginLogoGroup";
import { SortedPluginInstallation } from "../Plugins/hooks/usePlugins";
import { useAppContext } from "../context/appContext";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";
import "./PluginsTile.scss";
import {
  PluginCategory,
  usedPluginCategories,
} from "./hooks/useResourceSummary";

type Props = {
  usedCategories: usedPluginCategories;
  availableCategories: PluginCategory[];
};

const CLASS_NAME = "plugins-tile";

const AVAILABLE_CATEGORIES = "AvailableCategories";
const INSTALLED_CATEGORIES = "InstalledCategories";

function PluginsTile({ usedCategories, availableCategories }: Props) {
  const { trackEvent } = useTracking();
  const { baseUrl } = useResourceBaseUrl();

  const catalogUrl = `${baseUrl}/plugins/catalog`;
  const installedUrl = `${baseUrl}/plugins/installed`;

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
    </Panel>
  );
}

type AvailableCategoryProps = {
  category: PluginCategory;
  onClick?: (location: string, category: PluginCategory) => void;
};
function AvailableCategory({ category, onClick }: AvailableCategoryProps) {
  const { baseUrl } = useResourceBaseUrl();

  const url = `${baseUrl}/plugins/catalog/${encodeURIComponent(category.name)}`;

  return (
    <List listStyle={EnumListStyle.Default}>
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
  const { baseUrl } = useResourceBaseUrl();
  const { currentResource } = useAppContext();

  const url = `${baseUrl}/plugins/installed`;

  return (
    <List listStyle={EnumListStyle.Dark}>
      <ListItem
        to={url}
        onClick={() => {
          onClick(INSTALLED_CATEGORIES, category);
        }}
        direction={EnumFlexDirection.Column}
        gap={EnumGapSize.Large}
        end={
          <PluginLogoGroup
            iconSize="medium"
            installedPlugins={installedPlugins}
            resource={currentResource}
          />
        }
      >
        <FlexItem itemsAlign={EnumItemsAlign.Center} gap={EnumGapSize.Small}>
          <EnabledIndicator enabled={true} />
          <TitleAndIcon icon={category.icon} title={category.name} />
        </FlexItem>
      </ListItem>
    </List>
  );
}

export { PluginsTile };
