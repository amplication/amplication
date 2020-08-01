import React from "react";
import { NavLink } from "react-router-dom";
import ApplicationBadge from "./ApplicationBadge";

import "./ApplicationCard.scss";

type Props = {
  id: string;
  name: string;
  description: string;
  color?: string;
};

function ApplicationCard({ id, name, color, description }: Props) {
  return (
    <NavLink to={`/${id}/home`} className="application-card">
      <div className="application-card__header">
        <ApplicationBadge name={name} expanded={true} url=""></ApplicationBadge>
        <div className="application-card__version">v9</div>
      </div>

      <div className="application-card__description">{description}</div>
    </NavLink>
  );
}

export default ApplicationCard;
