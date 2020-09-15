import React from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";

import "./ApplicationBadge.scss";

type Props = {
  expanded: boolean;
  url?: string;
  name: string;
  color?: string;
  large?: boolean;
  hideFullName?: boolean;
};

function ApplicationBadge({
  expanded,
  url,
  name,
  color,
  large,
  hideFullName,
}: Props) {
  const badgeNode = (
    <>
      <div
        className="application-badge__app-icon"
        style={{ backgroundColor: color }}
      >
        {name && name.substr(0, 1).toUpperCase()}
      </div>
      {!hideFullName && (
        <div className="application-badge__app-name">{name}</div>
      )}
    </>
  );
  return (
    <div
      className={classNames(
        "application-badge",
        {
          "application-badge--expanded": expanded,
        },
        {
          "application-badge--large": large,
        }
      )}
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
