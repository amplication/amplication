import React, { useCallback } from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "@rmwc/icon";
import { Tooltip } from "@primer/components";
import { useTracking } from "../util/analytics";

import * as models from "../models";
import { format } from "date-fns";

import "./ApplicationListItem.scss";
import { BuildStatusIcons } from "../VersionControl/BuildStatusIcons";
import { CircleBadge, EnumPanelStyle, Panel } from "@amplication/design-system";

type Props = {
  app: models.App;
};

const DATE_FORMAT = "P p";
const CLASS_NAME = "application-list-item";

function ApplicationListItem({ app }: Props) {
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
    <NavLink to={`/${id}`}>
      <Panel
        className={CLASS_NAME}
        clickable
        onClick={handleClick}
        panelStyle={EnumPanelStyle.Bordered}
      >
        <div className={`${CLASS_NAME}__row`}>
          <CircleBadge name={name} color={color} />

          <span className={`${CLASS_NAME}__title`}>{name}</span>

          <span className="spacer" />
        </div>
        <div className={`${CLASS_NAME}__row`}>
          <span className={`${CLASS_NAME}__description`}>{description}</span>
        </div>
        <div className={`${CLASS_NAME}__row`}>
          {lastBuildDate && (
            <div className={`${CLASS_NAME}__recently-used`}>
              <Icon icon="clock" />
              <Tooltip
                aria-label={`Last build: ${format(lastBuildDate, DATE_FORMAT)}`}
              >
                <span>Last build </span>
                {format(lastBuildDate, "PP")}
              </Tooltip>
            </div>
          )}
          <BuildStatusIcons build={app.builds[0]} />
          <span className="spacer" />
        </div>
      </Panel>
    </NavLink>
  );
}

export default ApplicationListItem;
