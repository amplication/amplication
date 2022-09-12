import React, { useCallback } from "react";
import * as models from "../models";

import { Button, EnumButtonStyle } from "../Components/Button";

import {
  EnumHorizontalRuleStyle,
  EnumPanelStyle,
  HorizontalRule,
  Icon,
  Panel,
  Toggle,
} from "@amplication/design-system";
import "./PluginsCatalogItem.scss";
import { Plugin } from "./hooks/usePlugins";

type Props = {
  plugin: Plugin;
  pluginInstallation: models.PluginInstallation | null;
  onInstall?: (plugin: Plugin) => void;
  onEnableStateChange?: (pluginInstallation: models.PluginInstallation) => void;
  isDraggable?: boolean;
};

const CLASS_NAME = "plugins-catalog-item";

function PluginsCatalogItem({
  plugin,
  pluginInstallation,
  onInstall,
  onEnableStateChange,
  isDraggable,
}: Props) {
  const { name, description } = plugin || {};

  // const handlePromote = useCallback(() => {}, []);

  // const handleDemote = useCallback(() => {}, []);

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
      {pluginInstallation && isDraggable && (
        <>
          <div className={`${CLASS_NAME}__row`}>
            <Icon icon="drag" className={`${CLASS_NAME}__drag`} />
            <Toggle
              title="enabled"
              onValueChange={handleEnableStateChange}
              checked={pluginInstallation.enabled}
            />
            <div className={`${CLASS_NAME}__order`}>
              <span>{pluginInstallation.order}</span>
            </div>
          </div>
          <HorizontalRule style={EnumHorizontalRuleStyle.Black10} />
        </>
      )}
      <div className={`${CLASS_NAME}__row `}>
        <span className={`${CLASS_NAME}__logo`}>
          {plugin.icon ? (
            <img src="" alt="plugin logo" />
          ) : (
            <Icon icon="plugin" />
          )}
        </span>
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
        )}{" "}
      </div>
    </Panel>
  );
}

export default PluginsCatalogItem;
