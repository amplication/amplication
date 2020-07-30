import React from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";

import "./ApplicationBadge.scss";

type Props = {
  expanded: boolean;
  url: string;
};

function ApplicationBadge({ expanded, url }: Props) {
  return (
    <div
      className={classNames("application-badge", {
        "application-badge--expanded": expanded,
      })}
    >
      <NavLink to={url}>
        <div className="application-badge__app-icon">A</div>
        <div className="application-badge__app-name">My Cool App</div>
      </NavLink>
    </div>
  );
}

export default ApplicationBadge;
