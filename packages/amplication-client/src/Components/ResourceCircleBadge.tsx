import { CircleBadge, Icon } from "@amplication/design-system";
import React from "react";
import * as models from "../models";
import { resourceThemeMap } from "../util/resourceThemeMap";

interface Props {
  type: models.EnumResourceType;
  size?: "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge";
}

const ResourceCircleBadge: React.FC<Props> = ({ type, size = "medium" }) => (
  <CircleBadge color={resourceThemeMap[type].color} size={size}>
    <Icon icon={resourceThemeMap[type].icon} size={"small"} />
  </CircleBadge>
);

export default ResourceCircleBadge;
