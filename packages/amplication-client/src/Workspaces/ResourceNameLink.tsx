import * as models from "../models";

import { EnumTextStyle, Text } from "@amplication/ui/design-system";
import { Link } from "react-router-dom";
import "./ResourceNameLink.scss";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";
import { useMemo } from "react";
import { EnumResourceType } from "../models";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";

type Props = {
  resource: models.Resource;
};

const CLASS_NAME = "resource-name-link";

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

  return (
    <Link className={CLASS_NAME} to={to}>
      <Text textStyle={EnumTextStyle.Tag}>{name}</Text>
    </Link>
  );
}

export default ResourceNameLink;
