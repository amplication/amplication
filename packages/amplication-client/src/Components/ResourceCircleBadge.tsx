import { CircleBadge, Icon, Tooltip } from "@amplication/ui/design-system";
import React from "react";
import * as models from "../models";
import { resourceThemeMap } from "../Resource/constants";

interface Props {
  type: models.EnumResourceType;
  size?: "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge";
  showTooltip?: boolean;
}

const ResourceCircleBadge: React.FC<Props> = ({
  type,
  size = "medium",
  showTooltip = false,
}) => {
  const element = (
    <CircleBadge color={resourceThemeMap[type].color} size={size}>
      <Icon icon={resourceThemeMap[type].icon} size={"small"} />
    </CircleBadge>
  );

  if (!showTooltip) {
    return element;
  }

  return (
    <Tooltip title={resourceThemeMap[type].name} direction="ne">
      {element}
    </Tooltip>
  );
};

export default ResourceCircleBadge;
