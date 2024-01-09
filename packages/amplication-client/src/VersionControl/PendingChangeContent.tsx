import * as models from "../models";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/appContext";
import {
  EnumTextColor,
  EnumTextStyle,
  Text,
} from "@amplication/ui/design-system";

type Props = {
  change: models.PendingChange;
  name: string;
  relativeUrl: string;
  linkToOrigin: boolean;
};

const PendingChangeContent = ({
  change,
  name,
  relativeUrl,
  linkToOrigin,
}: Props) => {
  const { currentWorkspace, currentProject } = useContext(AppContext);

  const isProjectConfigResourceType =
    change.resource.resourceType ===
    models.EnumResourceType.ProjectConfiguration;

  const url = isProjectConfigResourceType
    ? `/${currentWorkspace?.id}/${currentProject?.id}/settings/general`
    : `/${currentWorkspace?.id}/${currentProject?.id}/${change.resource.id}/${relativeUrl}`;

  const nameElement = (
    <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
      {name}
    </Text>
  );

  return linkToOrigin ? (
    <Link to={url}>{nameElement}</Link>
  ) : (
    <span>{nameElement}</span>
  );
};
export default PendingChangeContent;
