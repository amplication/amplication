import { CircleBadge, Icon, Tooltip } from "@amplication/ui/design-system";
import React, { useMemo } from "react";
import * as models from "../models";
import { resourceThemeMap } from "../Resource/constants";

interface Props {
  resource: models.Resource;
  size?: "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge";
  showTooltip?: boolean;
}

const DEFAULT_BADGE_COLOR = "var(--gray-30)";

const ResourceTypeBadge: React.FC<Props> = ({
  resource,
  size = "medium",
  showTooltip = false,
}) => {
  const badgeData = useMemo((): {
    color: string;
    icon: string;
    name: string;
  } => {
    if (resource?.blueprint) {
      return {
        color: resource.blueprint.color || DEFAULT_BADGE_COLOR,
        icon: "hexagon",
        name: resource.blueprint.name,
      };
    }

    return resourceThemeMap[
      resource?.resourceType || models.EnumResourceType.Service
    ];
  }, [resource?.blueprint, resource?.resourceType]);

  const element = (
    <CircleBadge color={badgeData.color} size={size}>
      <Icon icon={badgeData.icon} size={"small"} />
    </CircleBadge>
  );

  if (!showTooltip) {
    return element;
  }

  return (
    <Tooltip title={badgeData.name} direction="ne">
      {element}
    </Tooltip>
  );
};

export default ResourceTypeBadge;
