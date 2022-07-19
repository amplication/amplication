import { CircleBadge, Icon } from "@amplication/design-system";
import React from "react";

interface Props {
  type: "settings" | "service" | "api" | "queue";
  size?: "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge";
}

const resourceMap = {
  settings: {
    icon: "app-settings",
    color: "#FFBD70",
  },
  service: {
    icon: "services",
    color: "#A787FF",
  },
  api: {
    icon: "api",
    color: "#53DBEE",
  },
  queue: {
    icon: "queue",
    color: "#8DD9B9",
  },
};

const ResourceCircleBadge: React.FC<Props> = ({ type, size = "medium" }) => (
  <CircleBadge color={resourceMap[type].color} size={size}>
    <Icon icon={resourceMap[type].icon} />
  </CircleBadge>
);

export default ResourceCircleBadge;
