import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";

import * as models from "../models";
import {
  Panel,
  EnumPanelStyle,
  Icon,
  CircularProgress,
} from "@amplication/design-system";

import { GET_ROLES } from "../Roles/RoleList";
import "./RolesTile.scss";
import { useTracking, Event as TrackEvent } from "../util/analytics";
import { SvgThemeImage, EnumImages } from "../Components/SvgThemeImage";

type Props = {
  resourceId: string;
};

const CLASS_NAME = "roles-tile";

const EVENT_DATA: TrackEvent = {
  eventName: "rolesTileClick",
};

function RolesTile({ resourceId }: Props) {
  const history = useHistory();

  const { data, loading } = useQuery<{
    appRoles: models.ResourceRole[];
  }>(GET_ROLES, {
    variables: {
      id: resourceId,
    },
  });
  const { trackEvent } = useTracking();

  const handleClick = useCallback(
    (event) => {
      trackEvent(EVENT_DATA);
      history.push(`/${resourceId}/roles`);
    },
    [history, trackEvent, resourceId]
  );

  return (
    <Panel
      className={`${CLASS_NAME}`}
      clickable
      onClick={handleClick}
      panelStyle={EnumPanelStyle.Bordered}
    >
      <div className={`${CLASS_NAME}__content`}>
        <div className={`${CLASS_NAME}__content__details`}>
          <h2>Roles</h2>
          Create roles and granularly set permissions per entity or specific
          fields.
          {loading ? (
            <CircularProgress />
          ) : (
            <span className={`${CLASS_NAME}__content__details__summary`}>
              <Icon icon="lock" size="medium" />

              {data?.appRoles.length}
              {data?.appRoles.length > 1 ? " roles" : " role"}
            </span>
          )}
        </div>
        <SvgThemeImage image={EnumImages.Roles} />
      </div>
    </Panel>
  );
}

export default RolesTile;
