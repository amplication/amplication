import { useCallback, useContext } from "react";
import * as models from "../models";
import Chip from "@mui/material/Chip";
import { Button, EnumButtonStyle } from "../Components/Button";

import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  ListItem,
  Text,
  Toggle,
} from "@amplication/ui/design-system";
import { Link, useHistory } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { REACT_APP_PLUGIN_VERSION_USE_LATEST } from "../env";
import { PluginLogo } from "./PluginLogo";
import "./PluginsCatalogItem.scss";
import { LATEST_VERSION_TAG } from "./constant";
import { Plugin, PluginVersion } from "./hooks/usePlugins";

type Props = {
  plugin: Plugin;
  pluginInstallation: models.PluginInstallation;
  onInstall?: (plugin: Plugin, pluginVersion: PluginVersion) => void;
  onOrderChange?: (obj: { id: string; order: number }) => void;
  onEnableStateChange?: (pluginInstallation: models.PluginInstallation) => void;
  order?: number;
  isDraggable?: boolean;
};

const pluginUseLatest = REACT_APP_PLUGIN_VERSION_USE_LATEST === "true";
const CLASS_NAME = "plugins-catalog-item";

function PluginsCatalogItem({
  plugin,
  pluginInstallation,
  onInstall,
  onOrderChange,
  onEnableStateChange,
  order,
  isDraggable,
}: Props) {
  const { name, description } = plugin || {};
  const history = useHistory();
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  const handlePromote = useCallback(() => {
    order &&
      onOrderChange &&
      pluginInstallation &&
      onOrderChange({ id: pluginInstallation?.id, order: order + 1 });
  }, [onOrderChange, order, pluginInstallation]);

  const handleDemote = useCallback(() => {
    order &&
      onOrderChange &&
      pluginInstallation &&
      onOrderChange({ id: pluginInstallation?.id, order: order - 1 });
  }, [onOrderChange, order, pluginInstallation]);

  const handleInstall = useCallback(() => {
    // Get the "latest" version or the first one by the env variable flag
    const hardcodedLatestVersion = pluginUseLatest
      ? plugin.versions.find(
          (version) => version.version === LATEST_VERSION_TAG
        )
      : plugin.versions.find(
          (version) => version.version !== LATEST_VERSION_TAG
        );

    onInstall && onInstall(plugin, hardcodedLatestVersion);
  }, [onInstall, plugin]);

  const handleEnableStateChange = useCallback(() => {
    onEnableStateChange && onEnableStateChange(pluginInstallation);
  }, [onEnableStateChange, pluginInstallation]);

  const handleChipClick = useCallback((category) => {
    history.push(
      `/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/plugins/catalog/${category}`
    );
  }, []);

  return (
    <ListItem>
      {pluginInstallation && (
        <>
          <FlexItem margin={EnumFlexItemMargin.Bottom}>
            <FlexItem>
              <FlexItem.FlexStart>
                <Toggle
                  title="enabled"
                  onValueChange={handleEnableStateChange}
                  checked={pluginInstallation.enabled}
                />
              </FlexItem.FlexStart>
              <FlexItem.FlexEnd>
                {isDraggable && (
                  <div className={`${CLASS_NAME}__order`}>
                    <Button
                      buttonStyle={EnumButtonStyle.Text}
                      onClick={handleDemote}
                      icon="arrow_up"
                    />
                    <span>{order}</span>
                    <Button
                      buttonStyle={EnumButtonStyle.Text}
                      onClick={handlePromote}
                      icon="arrow_down"
                    />
                  </div>
                )}
              </FlexItem.FlexEnd>
            </FlexItem>
          </FlexItem>
        </>
      )}
      <FlexItem>
        <FlexItem.FlexStart>
          <PluginLogo plugin={plugin} />
        </FlexItem.FlexStart>
        <FlexItem direction={EnumFlexDirection.Column}>
          <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
            {name}
          </Text>
          <Text textStyle={EnumTextStyle.Description}>{description}</Text>
        </FlexItem>
        <FlexItem.FlexEnd>
          {!pluginInstallation ? (
            <Button
              className={`${CLASS_NAME}__install`}
              buttonStyle={EnumButtonStyle.Primary}
              onClick={handleInstall}
            >
              Install
            </Button>
          ) : (
            <Link
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/plugins/installed/${pluginInstallation.id}`}
            >
              <Button
                className={`${CLASS_NAME}__install`}
                buttonStyle={EnumButtonStyle.Outline}
              >
                Settings
              </Button>
            </Link>
          )}
        </FlexItem.FlexEnd>
      </FlexItem>
      <FlexItem margin={EnumFlexItemMargin.Top}>
        <FlexItem.FlexStart>
          <a href={plugin?.github} target="github_plugin">
            <Text
              textStyle={EnumTextStyle.Description}
              textColor={EnumTextColor.ThemeTurquoise}
            >
              View on GitHub
            </Text>
          </a>
        </FlexItem.FlexStart>
        <FlexItem.FlexEnd className={`${CLASS_NAME}__category`}>
          {plugin &&
            plugin.categories.map((category: string) => (
              <Chip
                className={`${CLASS_NAME}__category_chip`}
                label={category}
                key={category}
                variant="filled"
                onClick={() => handleChipClick(category)}
              />
            ))}
        </FlexItem.FlexEnd>
      </FlexItem>
    </ListItem>
  );
}

export default PluginsCatalogItem;
