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
import { useMemo } from "react";
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
import { use } from "ast-types";

type Props = {
  usedCategories: usedPluginCategories;
  availableCategories: PluginCategory[];
};

const CLASS_NAME = "plugins-tile";
const PLUGIN_LOGOS_CLASS_NAME = "plugin-logos";
const TOOLTIP_DIRECTION = "n";

function PluginsTile({ usedCategories, availableCategories }: Props) {
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
        <FlexItem.FlexStart direction={EnumFlexDirection.Row}>
          <Icon icon={"plugin"} color={EnumTextColor.White} />
          <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
            Plugins
          </Text>
        </FlexItem.FlexStart>
        <Text textStyle={EnumTextStyle.Subtle}>
          Enhance your service with additional functionality and accelerate
          development with Amplication's wide range of plugins and integrations.
        </Text>
      </FlexItem>
      <HorizontalRule />
      <FlexItem margin={EnumFlexItemMargin.Both}>
        <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
          Available Plugins
        </Text>
      </FlexItem>

      <div className={CLASS_NAME}>
        {availableCategoriesList.map((category) => (
          <AvailableCategory key={category.name} category={category} />
        ))}
      </div>

      <HorizontalRule />
      <FlexItem margin={EnumFlexItemMargin.Both}>
        <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
          Installed Plugins
        </Text>
      </FlexItem>

      <div className={CLASS_NAME}>
        {installedCategories.map((category) => (
          <InstalledCategory key={category.category.name} {...category} />
        ))}
      </div>
    </Panel>
  );
}

type AvailableCategoryProps = {
  category: PluginCategory;
};
function AvailableCategory({ category }: AvailableCategoryProps) {
  const { currentWorkspace, currentProject, currentResource } = useAppContext();

  const url = `/${currentWorkspace.id}/${currentProject.id}/${
    currentResource.id
  }/plugins/catalog/${encodeURIComponent(category.name)}`;

  return (
    <List listStyle={EnumListStyle.Dark}>
      <ListItem
        to={url}
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
        <FlexItem itemsAlign={EnumItemsAlign.Center} gap={EnumGapSize.Small}>
          <Icon icon={category.icon} color={EnumTextColor.White} />
          <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
            {category.name}
          </Text>
        </FlexItem>

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
};
function InstalledCategory({
  category,
  installedPlugins,
}: InstalledCategoryProps) {
  const { currentWorkspace, currentProject, currentResource } = useAppContext();

  const url = `/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/plugins/installed`;

  return (
    <List listStyle={EnumListStyle.Default}>
      <ListItem
        to={url}
        direction={EnumFlexDirection.Column}
        gap={EnumGapSize.Large}
        end={<PluginLogos installedPlugins={installedPlugins} />}
      >
        <FlexItem itemsAlign={EnumItemsAlign.Center} gap={EnumGapSize.Small}>
          <EnabledIndicator enabled={true} />
          <Icon icon={category.icon} color={EnumTextColor.White} />
          <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
            {category.name}
          </Text>
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
  const { pluginCatalog } = usePlugins(currentResource?.id);

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
