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
    <NavLink to={`/${id}`} className="application-card">
      <div className="application-card__header">
        <ApplicationBadge name={name} expanded color={color} />
        {/* @todo: use version from server */}
        <div className="application-card__version">V9</div>
      </div>

      <div className="application-card__description">{description}</div>
      <div className="application-card__footer">
        <div>
          Created
          <div className="application-card__recently-used">
            <Icon icon="clock" />
            <Tooltip aria-label={format(updateAtData, "P p")}>
              {format(updateAtData, "PP")}
            </Tooltip>
          </div>
        </div>
      </div>
    </NavLink>
  );
}

export default ApplicationCard;
