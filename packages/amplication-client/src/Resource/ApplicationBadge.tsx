import React from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { CircleBadge } from "@amplication/design-system";
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
      <CircleBadge name={name} color={color} />
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
