import * as models from "../models";

import { useMemo } from "react";
import DataGridLink from "../Components/DataGridLink";
import { EnumResourceType } from "../models";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";

type Props = {
  resource: models.Resource;
};

function ResourceNameLink({ resource }: Props) {
  const { id, name, resourceType } = resource;

  const overrideIsPlatformConsole =
    models.EnumResourceType.ServiceTemplate === resourceType ||
    models.EnumResourceType.PluginRepository === resourceType;

  const { baseUrl } = useResourceBaseUrl({
    overrideResourceId: id,
    overrideProjectId: resource.projectId,
    overrideIsPlatformConsole: overrideIsPlatformConsole,
  });

  const { baseUrl: projectBaseUrl } = useProjectBaseUrl({
    overrideProjectId: resource.projectId,
    overrideIsPlatformConsole: overrideIsPlatformConsole,
  });

  const to = useMemo(() => {
    switch (resourceType) {
      case EnumResourceType.ProjectConfiguration:
        return projectBaseUrl;
      case EnumResourceType.PluginRepository:
        return `${projectBaseUrl}/private-plugins`;
      default:
        return baseUrl;
    }
  }, [baseUrl, projectBaseUrl, resourceType]);

  return <DataGridLink to={to} text={name} />;
}

export default ResourceNameLink;
