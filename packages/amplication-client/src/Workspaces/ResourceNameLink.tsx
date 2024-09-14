import * as models from "../models";

import { EnumTextStyle, Text } from "@amplication/ui/design-system";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import "./resourceNameLink.scss";

type Props = {
  resource: models.Resource;
};

const CLASS_NAME = "resource-name-link";

function ResourceNameLink({ resource }: Props) {
  const { currentWorkspace, currentProject } = useAppContext();
  const { id, name } = resource;

  return (
    <Link
      className={CLASS_NAME}
      to={`/${currentWorkspace?.id}/${currentProject?.id}/${id}`}
    >
      <Text textStyle={EnumTextStyle.Tag}>{name}</Text>
    </Link>
  );
}

export default ResourceNameLink;
