import React from "react";
import { NavLink } from "react-router-dom";
import ApplicationBadge from "./ApplicationBadge";
import { Icon } from "@rmwc/icon";
import { Tooltip } from "@primer/components";

import * as models from "../models";
import { format } from "date-fns";

import "./ApplicationCard.scss";

type Props = {
  app: models.App;
};

function ApplicationCard({ app }: Props) {
  const { id, name, description, updatedAt } = app;

  const [build] = app.builds;
  const updateAtData = new Date(updatedAt);
  return (
    <NavLink to={`/${id}`} className="application-card">
      <div className="application-card__header">
        <ApplicationBadge name={name} expanded />
        <div className="application-card__version">
          V{build?.version || "0"}
        </div>
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
