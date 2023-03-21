import React, { useCallback, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Plugin, OnPluginDropped } from "./hooks/usePlugins";
import * as models from "../models";

import { Button, EnumButtonStyle } from "../Components/Button";

import {
  EnumHorizontalRuleStyle,
  EnumPanelStyle,
  HorizontalRule,
  Icon,
  Panel,
  Toggle,
} from "@amplication/ui/design-system";
import "./PluginsCatalogItem.scss";

export interface XYCoord {
  x: number;
  y: number;
}
type Identifier = string | symbol;

type Props = {
  plugin: Plugin;
  pluginInstallation: models.PluginInstallation | null;
  onInstall?: (plugin: Plugin) => void;
  onEnableStateChange?: (pluginInstallation: models.PluginInstallation) => void;
  onPluginDropped: OnPluginDropped;
};

const PluginItemDragType = "pluginItemDrag";

const CLASS_NAME = "plugins-catalog-item";

function DragPluginsCatalogItem({
  plugin,
  pluginInstallation,
  onInstall,
  onEnableStateChange,
  onPluginDropped,
}: Props) {
  const { name, description } = plugin || {};
  const PluginCatalogItemRef = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    models.PluginInstallation,
    void,
    { handlerId: Identifier | null }
  >({
    accept: PluginItemDragType,
    collect(monitor) {
      return { handlerId: monitor.getHandlerId() };
    },
    hover(item: models.PluginInstallation, monitor) {
      if (!PluginCatalogItemRef.current) return;

      const dragIndex = (item as any).order;
      const hoverIndex = (pluginInstallation as any)?.order;
      if (!hoverIndex) return;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect =
        PluginCatalogItemRef.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      onPluginDropped(item, pluginInstallation);
      // item.order = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: PluginItemDragType,
    item: () => {
      return pluginInstallation;
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(PluginCatalogItemRef));

  const handlePromote = useCallback(() => {}, []);

  const handleDemote = useCallback(() => {}, []);

  const handleInstall = useCallback(() => {
    onInstall && onInstall(plugin);
  }, [onInstall, plugin]);

  const handleEnableStateChange = useCallback(() => {
    onEnableStateChange &&
      pluginInstallation &&
      onEnableStateChange(pluginInstallation);
  }, [onEnableStateChange, pluginInstallation]);

  return (
    <Panel
      className={CLASS_NAME}
      panelStyle={EnumPanelStyle.Bordered}
      ref={PluginCatalogItemRef}
      data-handler-id={handlerId}
      style={{ opacity }}
    >
      {pluginInstallation && (
        <>
          <div className={`${CLASS_NAME}__row`}>
            <Toggle
              title="enabled"
              onValueChange={handleEnableStateChange}
              checked={pluginInstallation.enabled}
            />
            <div className={`${CLASS_NAME}__order`}>
              <Button
                buttonStyle={EnumButtonStyle.Text}
                onClick={handlePromote}
                icon="arrow_up"
              />
              <span>{(pluginInstallation as any).order}</span>
              <Button
                buttonStyle={EnumButtonStyle.Text}
                onClick={handleDemote}
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

export default DragPluginsCatalogItem;
