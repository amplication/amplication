import {
  EnumTextColor,
  EnumTextStyle,
  Text,
  Tooltip,
} from "@amplication/ui/design-system";

import { PluginInstallation, Resource } from "../models";
import usePlugins from "./hooks/usePlugins";
import { PluginLogo } from "./PluginLogo";
import "./PluginLogoGroup.scss";
import classNames from "classnames";
import { useEffect } from "react";

const CLASS_NAME = "plugin-logos";

type IconSize = "small" | "medium";

type PluginLogosProps = {
  resource: Resource;
  installedPlugins: PluginInstallation[];
  iconSize?: IconSize;
};
function PluginLogoGroup({
  iconSize,
  resource,
  installedPlugins,
}: PluginLogosProps) {
  const { pluginCatalog, privatePluginCatalog, loadPrivatePluginsCatalog } =
    usePlugins(resource?.id, null, resource?.codeGenerator);

  useEffect(() => {
    loadPrivatePluginsCatalog();
  }, []);

  if (!installedPlugins || installedPlugins.length === 0) {
    return null;
  }

  const firstPlugins = installedPlugins.slice(0, 4);
  const restPlugins = installedPlugins.slice(4);

  return (
    <div className={classNames(CLASS_NAME, `${CLASS_NAME}--${iconSize}`)}>
      {firstPlugins.map((plugin) => (
        <Tooltip aria-label={plugin.displayName} noDelay key={plugin.id}>
          <PluginLogo
            iconSize={iconSize}
            plugin={
              plugin.isPrivate
                ? privatePluginCatalog[plugin.pluginId]
                : pluginCatalog[plugin.pluginId]
            }
          />
        </Tooltip>
      ))}
      {restPlugins.length > 0 && (
        <Tooltip
          aria-label={restPlugins
            .map((plugin) => plugin.displayName)
            .join(", ")}
          noDelay
        >
          <div className={`${CLASS_NAME}__more-plugins`}>
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

export default PluginLogoGroup;
