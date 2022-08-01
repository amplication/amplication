import { CircleBadge, Icon } from "@amplication/design-system";
import React from "react";
import * as models from "../models";

interface Props {
  type: models.EnumResourceType;
  size?: "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge";
}

const resourceMap: {
  [key in models.EnumResourceType]: {
    icon: string;
    color: string;
  };
} = {
  [models.EnumResourceType.ProjectConfiguration]: {
    icon: "app-settings",
    color: "#FFBD70",
  },
  [models.EnumResourceType.Service]: {
    icon: "services",
    color: "#A787FF",
  },
};

const ResourceCircleBadge: React.FC<Props> = ({ type, size = "medium" }) => (
  <CircleBadge color={resourceMap[type].color} size={size}>
    <Icon icon={resourceMap[type].icon} />
  </CircleBadge>
);

export default ResourceCircleBadge;
