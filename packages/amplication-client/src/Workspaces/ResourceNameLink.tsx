import * as models from "../models";

import { EnumTextStyle, Text } from "@amplication/ui/design-system";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import "./ResourceNameLink.scss";

type Props = {
  resource: models.Resource;
};

const CLASS_NAME = "resource-name-link";

function ResourceNameLink({ resource }: Props) {
  const { currentWorkspace, currentProject } = useAppContext();
  const { id, name } = resource;

  const isPlatformLink =
    resource.resourceType === models.EnumResourceType.ServiceTemplate;

  return (
    <Link
      className={CLASS_NAME}
      to={`/${currentWorkspace?.id}/${isPlatformLink ? "platform/" : ""}${
        currentProject?.id
      }/${id}`}
    >
      <Text textStyle={EnumTextStyle.Tag}>{name}</Text>
    </Link>
  );
}

export default ResourceNameLink;
