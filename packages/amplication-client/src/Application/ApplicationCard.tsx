import React from "react";
import { NavLink } from "react-router-dom";
import ApplicationBadge from "./ApplicationBadge";
import { Icon } from "@rmwc/icon";
import { Tooltip } from "@primer/components";
import { format, formatDistanceToNow } from "date-fns";

import "./ApplicationCard.scss";

type Props = {
  id: string;
  name: string;
  description: string;
  color?: string;
  updatedAt: Date;
};

function ApplicationCard({ id, name, color, description, updatedAt }: Props) {
  const updateAtData = new Date(updatedAt);
  return (
    <NavLink to={`/${id}/home`} className="application-card">
      <div className="application-card__header">
        <ApplicationBadge name={name} expanded color={color} />
        {/* @todo: use version from server */}
        <div className="application-card__version">v9</div>
      </div>

      <div className="application-card__description">{description}</div>
      <div className="application-card__footer">
        <div className="application-card__recently-used">
          <Icon icon="history" />
          <Tooltip aria-label={format(updateAtData, "P p")}>
            {formatDistanceToNow(updateAtData)}
          </Tooltip>
        </div>
        <div className="application-card__recent-users">
          <ul className="avatars">
            <li className="avatars__item">
              <span className="avatars__others">+3</span>
            </li>
            <li className="avatars__item">
              <span className="avatars__initials">LY</span>
            </li>
            <li className="avatars__item">
              <span className="avatars__initials">IH</span>
            </li>
            <li className="avatars__item">
              <span className="avatars__initials">AR</span>
            </li>
            <li className="avatars__item">
              <span className="avatars__initials">YH</span>
            </li>
          </ul>
        </div>
      </div>
    </NavLink>
  );
}

export default ApplicationCard;
