import React, { useCallback } from "react";
import { NavLink } from "react-router-dom";
import ApplicationBadge from "./ApplicationBadge";
import { Icon } from "@rmwc/icon";
import { Tooltip } from "@primer/components";
import { useTracking } from "../util/analytics";

import * as models from "../models";
import { format } from "date-fns";

import "./ApplicationCard.scss";

type Props = {
  app: models.App;
};

const DATE_FORMAT = "P p";

function ApplicationCard({ app }: Props) {
  const { id, name, description, updatedAt, color } = app;
  const { trackEvent } = useTracking();

  const handleClick = useCallback(() => {
    trackEvent({
      eventName: "applicationCardClick",
    });
  }, [trackEvent]);

  const updateAtData = new Date(updatedAt);
  return (
    <NavLink to={`/${id}`} className="application-card" onClick={handleClick}>
      <div className="application-card__header">
        <ApplicationBadge name={name} expanded color={color} />
      </div>
      <div className="application-card__description">{description}</div>
      <div className="application-card__footer">
        <div>
          Created
          <div className="application-card__recently-used">
            <Icon icon="clock" />
            <Tooltip aria-label={format(updateAtData, DATE_FORMAT)}>
              {format(updateAtData, "PP")}
            </Tooltip>
          </div>
        </div>
      </div>
    </NavLink>
  );
}

export default ApplicationCard;
