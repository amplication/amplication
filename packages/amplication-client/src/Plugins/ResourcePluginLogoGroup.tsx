import { Resource } from "../models";
import usePlugins from "./hooks/usePlugins";
import PluginLogoGroup from "./PluginLogoGroup";

type Props = {
  resource: Resource;
};
function ResourcePluginLogoGroup({ resource }: Props) {
  const { pluginInstallations } = usePlugins(
    resource.id,
    null,
    resource.codeGenerator
  );

  return (
    <PluginLogoGroup
      iconSize="medium"
      installedPlugins={pluginInstallations}
      resource={resource}
    />
  );
}

export default ResourcePluginLogoGroup;
