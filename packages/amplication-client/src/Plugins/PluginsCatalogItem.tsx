import React, { useCallback, useContext } from "react";
import * as models from "../models";

import { Button, EnumButtonStyle } from "../Components/Button";

import {
  EnumHorizontalRuleStyle,
  EnumPanelStyle,
  HorizontalRule,
  Panel,
  Toggle,
} from "@amplication/ui/design-system";
import { Link } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { Plugin, PluginVersion } from "./hooks/usePlugins";
import { PluginLogo } from "./PluginLogo";
import "./PluginsCatalogItem.scss";
import { LATEST_VERSION_TAG } from "./constant";
import { REACT_APP_PLUGIN_VERSION_USE_LATEST } from "../env";

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

  return (
    <Panel className={CLASS_NAME} panelStyle={EnumPanelStyle.Bordered}>
      {pluginInstallation && (
        <>
          <div className={`${CLASS_NAME}__row`}>
            {/* <Icon icon="drag" className={`${CLASS_NAME}__drag`} /> */}
            <Toggle
              title="enabled"
              onValueChange={handleEnableStateChange}
              checked={pluginInstallation.enabled}
              className={`${CLASS_NAME}__enabled`}
            />
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
            <Link
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/plugins/installed/${pluginInstallation.id}`}
            >
              <Button
                className={`${CLASS_NAME}__install`}
                buttonStyle={EnumButtonStyle.Secondary}
              >
                Settings
              </Button>
            </Link>
          </div>
          <HorizontalRule style={EnumHorizontalRuleStyle.Black10} />
        </>
      )}
      <div className={`${CLASS_NAME}__row `}>
        <PluginLogo plugin={plugin} />
        <div className={`${CLASS_NAME}__details`}>
          <div className={`${CLASS_NAME}__details__title`}>{name}</div>
          <span className={`${CLASS_NAME}__details__description`}>
            {description}
          </span>
        </div>
        {!pluginInstallation && (
          <Button
            className={`${CLASS_NAME}__install`}
            buttonStyle={EnumButtonStyle.Primary}
            onClick={handleInstall}
          >
            Install
          </Button>
        )}
      </div>
      <div className={`${CLASS_NAME}__row `}>
        <span className="spacer" />
        <span className={`${CLASS_NAME}__repo`}>
          <a href={plugin?.github} target="github_plugin">
            View on GitHub
          </a>
        </span>
      </div>
    </Panel>
  );
}

export default PluginsCatalogItem;
