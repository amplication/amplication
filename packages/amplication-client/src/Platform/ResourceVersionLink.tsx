import * as models from "../models";

import { VersionTag } from "@amplication/ui/design-system";
import { Link } from "react-router-dom";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";

type Props = {
  resourceVersion: models.ResourceVersion;
};

const CLASS_NAME = "resource-version-link";

function ResourceVersionLink({ resourceVersion }: Props) {
  const { id, version, resourceId } = resourceVersion;

  const { baseUrl } = useResourceBaseUrl({
    overrideResourceId: resourceId,
  });

  return (
    <Link className={CLASS_NAME} to={`${baseUrl}/versions/${id}`}>
      <VersionTag version={version} />
    </Link>
  );
}

export default ResourceVersionLink;
