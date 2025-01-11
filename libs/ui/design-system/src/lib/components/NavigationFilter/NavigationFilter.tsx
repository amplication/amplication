import React from "react";
import "./NavigationFilter.scss";
import { Icon } from "../Icon/Icon";
import { Tooltip } from "../Tooltip/Tooltip";

export type Props = {
  children: React.ReactNode;
};

const CLASS_NAME = "amp-navigation-filter";

export const NavigationFilter = ({ children }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <Tooltip
        aria-label={"Filters"}
        direction={"se"}
        noDelay
        style={{ lineHeight: 0 }}
      >
        <Icon icon="filter" />
      </Tooltip>
      {children}
    </div>
  );
};
