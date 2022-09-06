import React, { useCallback } from "react";
import * as models from "../models";

import { Button, EnumButtonStyle } from "../Components/Button";

import { EnumPanelStyle, Panel, Toggle } from "@amplication/design-system";
import "./PluginsCatalogItem.scss";
import { Plugin } from "./hooks/usePlugins";

type Props = {
  plugin: Plugin;
  pluginInstallation: models.PluginInstallation | null;
  onInstall?: (plugin: Plugin) => void;
  onEnableStateChange?: (pluginInstallation: models.PluginInstallation) => void;
};

const CLASS_NAME = "plugins-catalog-item";

function PluginsCatalogItem({
  plugin,
  pluginInstallation,
  onInstall,
  onEnableStateChange,
}: Props) {
  const { name, description } = plugin || {};

  const handleInstall = useCallback(() => {
    onInstall && onInstall(plugin);
  }, [onInstall, plugin]);

  const handleEnableStateChange = useCallback(() => {
    onEnableStateChange &&
      pluginInstallation &&
      onEnableStateChange(pluginInstallation);
  }, [onEnableStateChange, pluginInstallation]);

  return (
    <Panel className={CLASS_NAME} panelStyle={EnumPanelStyle.Bordered}>
      {pluginInstallation && (
        <div className={`${CLASS_NAME}__row`}>
          <Toggle
            title="enabled"
            onValueChange={handleEnableStateChange}
            checked={pluginInstallation.enabled}
          />
        </div>
      )}
      <div className={`${CLASS_NAME}__row`}>
        <span className={`${CLASS_NAME}__title`}>{name}</span>
        <span className="spacer" />
        {!pluginInstallation && (
          <Button buttonStyle={EnumButtonStyle.Primary} onClick={handleInstall}>
            Install
          </Button>
        )}{" "}
      </div>
      <div className={`${CLASS_NAME}__row`}>
        <span className={`${CLASS_NAME}__description`}>{description}</span>
      </div>
    </Panel>
  );
}

export default PluginsCatalogItem;
