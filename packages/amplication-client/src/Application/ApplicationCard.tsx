import React, { useCallback } from "react";
import { NavLink } from "react-router-dom";
import ApplicationBadge from "./ApplicationBadge";
import { Icon } from "@rmwc/icon";
import { Tooltip } from "@primer/components";
import { useTracking } from "../util/analytics";

import * as models from "../models";
import { format } from "date-fns";

import "./ApplicationCard.scss";
import { BuildStatusIcons } from "../VersionControl/BuildStatusIcons";

type Props = {
  app: models.App;
};

const DATE_FORMAT = "P p";

function ApplicationCard({ app }: Props) {
  const { id, name, description, color } = app;
  const { trackEvent } = useTracking();

  const handleClick = useCallback(() => {
    trackEvent({
      eventName: "applicationCardClick",
    });
  }, [trackEvent]);

  const lastBuildDate = app.builds[0]
    ? new Date(app.builds[0].createdAt)
    : undefined;
  return (
    <NavLink to={`/${id}`} className="application-card" onClick={handleClick}>
      <div className="application-card__header">
        <ApplicationBadge name={name} expanded color={color} />
      </div>
      <div className="application-card__description">{description}</div>
      <div className="application-card__footer">
        <div>
          {lastBuildDate && (
            <div className="application-card__recently-used">
              <Icon icon="clock" />
              <Tooltip
                aria-label={`Last build: ${format(lastBuildDate, DATE_FORMAT)}`}
              >
                {format(lastBuildDate, "PP")}
              </Tooltip>
            </div>
          )}
        </div>
        <div>
          <BuildStatusIcons build={app.builds[0]} />
        </div>
      </div>
    </NavLink>
  );
}

export default ApplicationCard;
