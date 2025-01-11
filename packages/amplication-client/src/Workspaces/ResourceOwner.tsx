import * as models from "../models";

import { EnumTextStyle, Text } from "@amplication/ui/design-system";
import { Link } from "react-router-dom";
import { TeamInfo } from "../Components/TeamInfo";
import { UserInfo } from "../Components/UserInfo";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";

type Props = {
  resource: models.Resource;
};

function ResourceOwner({ resource }: Props) {
  const { id, resourceType, owner } = resource;

  const overrideIsPlatformConsole =
    models.EnumResourceType.ServiceTemplate === resourceType;

  const { baseUrl } = useResourceBaseUrl({
    overrideResourceId: id,
    overrideProjectId: resource.projectId,
    overrideIsPlatformConsole: overrideIsPlatformConsole,
  });

  let content = null;

  if (resourceType === models.EnumResourceType.PluginRepository) {
    return null;
  }

  if (!owner) {
    content = <Text textStyle={EnumTextStyle.Description}>(not set)</Text>;
  } else if (owner["__typename"] === "User") {
    content = <UserInfo user={owner as models.User} showEmail={false} />;
  } else if (owner["__typename"] === "Team") {
    content = <TeamInfo team={owner as models.Team} />;
  }
  return <Link to={`${baseUrl}/settings/general`}>{content}</Link>;
}

export default ResourceOwner;
