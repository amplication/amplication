import * as models from "../models";
import ResourceCodeEngineVersion from "./ResourceCodeEngineVersion";

type Props = {
  resource: models.Resource;
};

function ResourceLastBuildVersion({ resource }: Props) {
  const lastBuild = resource.builds[0];

  if (!lastBuild) {
    return null;
  }

  return (
    <ResourceCodeEngineVersion
      version={lastBuild?.codeGeneratorVersion}
      codeGeneratorStrategy={resource.codeGeneratorStrategy}
      resourceId={resource.id}
    />
  );
}

export default ResourceLastBuildVersion;
