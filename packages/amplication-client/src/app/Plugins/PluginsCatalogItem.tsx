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
import { Plugin } from "./hooks/usePlugins";
import "./PluginsCatalogItem.scss";

type Props = {
  plugin: Plugin;
  pluginInstallation: models.PluginInstallation;
  onInstall?: (plugin: Plugin) => void;
  onOrderChange?: (obj: { id: string; order: number }) => void;
  onEnableStateChange?: (pluginInstallation: models.PluginInstallation) => void;
  order?: number;
  isDraggable?: boolean;
};

const CLASS_NAME = "plugins-catalog-item";
const PLUGIN_LOGO_BASE_URL =
  "https://raw.githubusercontent.com/amplication/plugin-catalog/master/assets/";

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
            {/* <Icon icon="drag" className={`${CLASS_NAME}__drag`} /> */}
            <Toggle
              title="enabled"
              onValueChange={handleEnableStateChange}
              checked={pluginInstallation.enabled}
              className={`${CLASS_NAME}__enabled`}
            />
            <div className={`${CLASS_NAME}__order`}>
              <Button
                buttonStyle={EnumButtonStyle.Text}
                onClick={handleDemote}
                icon="arrow_up"
              >
                <></>
              </Button>
              <span>{order}</span>
              <Button
                buttonStyle={EnumButtonStyle.Text}
                onClick={handlePromote}
                icon="arrow_down"
              >
                <></>
              </Button>
            </div>
          </div>
          <HorizontalRule style={EnumHorizontalRuleStyle.Black10} />
        </>
      )}
      <div className={`${CLASS_NAME}__row `}>
        <span className={`${CLASS_NAME}__logo`}>
          {plugin?.icon ? (
            <img
              src={`${PLUGIN_LOGO_BASE_URL}${plugin.icon}`}
              alt="plugin logo"
            />
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
        {!pluginInstallation ? (
          <Button
            className={`${CLASS_NAME}__install`}
            buttonStyle={EnumButtonStyle.Primary}
            onClick={handleInstall}
          >
            Install
          </Button>
        ) : (
          !isDraggable && (
            <Button
              className={`${CLASS_NAME}__install`}
              buttonStyle={EnumButtonStyle.Primary}
              disabled
            >
              Installed
            </Button>
          )
        )}
      </div>
      <div className={`${CLASS_NAME}__row `}>
        <span className="spacer" />
        <span className={`${CLASS_NAME}__repo`}>
          <a href={plugin?.repo} target="github_plugin">
            View on GitHub
          </a>
        </span>
      </div>
    </Panel>
  );
}

export default PluginsCatalogItem;
