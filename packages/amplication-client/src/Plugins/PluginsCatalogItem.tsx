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
  pluginInstallation: models.PluginInstallation;
  onInstall?: (plugin: Plugin) => void;
  onOrderChange?: (obj: { id: string; order: number; }) => void;
  onEnableStateChange?: (pluginInstallation: models.PluginInstallation) => void;
  order?: number;
  isDraggable?: boolean;
};

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

  const handlePromote = useCallback(() => {
    order && onOrderChange && pluginInstallation && onOrderChange({ id: pluginInstallation?.id, order: order + 1})
  }, [onOrderChange, order, pluginInstallation]);

  const handleDemote = useCallback(() => {
    order && onOrderChange && pluginInstallation && onOrderChange({ id: pluginInstallation?.id, order: order - 1})
  }, [onOrderChange, order, pluginInstallation]);

  const handleInstall = useCallback(() => {
    onInstall && onInstall(plugin);
  }, [onInstall, plugin]);

  const handleEnableStateChange = useCallback(() => {
    onEnableStateChange && onEnableStateChange(pluginInstallation);
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
