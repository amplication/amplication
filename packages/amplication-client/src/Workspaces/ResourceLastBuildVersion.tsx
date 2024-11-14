import * as models from "../models";
import ResourceCodeEngineVersion from "./ResourceCodeEngineVersion";

type Props = {
  resource: models.Resource;
};

function ResourceLastBuildVersion({ resource }: Props) {
  const lastBuild = resource.builds[0];

  const { resourceType } = resource;

  const version =
    resourceType === models.EnumResourceType.ServiceTemplate
      ? resource.codeGeneratorVersion
      : lastBuild?.codeGeneratorVersion;

  if (resourceType !== models.EnumResourceType.ServiceTemplate && !lastBuild) {
    return null;
  }

  return (
    <ResourceCodeEngineVersion
      version={version}
      codeGeneratorStrategy={resource.codeGeneratorStrategy}
      resource={resource}
    />
  );
}

export default ResourceLastBuildVersion;
