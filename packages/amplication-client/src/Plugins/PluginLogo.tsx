import {
  EnumIconFamily,
  Icon,
  useTagColorStyle,
} from "@amplication/ui/design-system";
import React from "react";
import { Plugin } from "./hooks/usePluginCatalog";

import "./PluginLogo.scss";

const PLUGIN_LOGO_BASE_URL =
  "https://raw.githubusercontent.com/amplication/plugin-catalog/master/assets/icons/";

const CLASS_NAME = "plugin-logo";

type Props = {
  plugin: Plugin;
  iconSize?: "small" | "medium" | "large" | "xlarge";
};

export const PluginLogo = ({ plugin, iconSize = "xlarge" }: Props) => {
  const { color } = useTagColorStyle(plugin?.color);

  return (
    <span className={CLASS_NAME}>
      {plugin?.isPrivate && plugin.icon ? (
        <Icon
          style={{ color: color }}
          icon={plugin.icon}
          size={iconSize}
          family={EnumIconFamily.Custom}
        />
      ) : plugin?.icon ? (
        <img src={`${PLUGIN_LOGO_BASE_URL}${plugin.icon}`} alt="plugin logo" />
      ) : (
        <Icon icon="plugin" size={iconSize} />
      )}
    </span>
  );
};
