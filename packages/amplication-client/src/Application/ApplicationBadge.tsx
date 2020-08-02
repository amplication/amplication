import React from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";

import "./ApplicationBadge.scss";

type Props = {
  expanded: boolean;
  url?: string;
  name: string;
  color?: string;
};

function ApplicationBadge({ expanded, url, name, color }: Props) {
  const badgeNode = (
    <>
      <div
        className="application-badge__app-icon"
        style={{ backgroundColor: color }}
      >
        {name.substr(0, 1).toUpperCase()}
      </div>
      <div className="application-badge__app-name">{name}</div>
    </>
  );
  return (
    <div
      className={classNames("application-badge", {
        "application-badge--expanded": expanded,
      })}
    >
      {url ? (
        <NavLink to={url}>{badgeNode}</NavLink>
      ) : (
        <span> {badgeNode} </span>
      )}
    </div>
  );
}

export default ApplicationBadge;
