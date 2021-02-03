import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import "@rmwc/snackbar/styles";
import { CircularProgress } from "@rmwc/circular-progress";
import { Icon } from "@rmwc/icon";

import * as models from "../models";
import { Panel, EnumPanelStyle } from "@amplication/design-system";

import { GET_ROLES } from "../Roles/RoleList";
import "./RolesTile.scss";
import { useTracking, Event as TrackEvent } from "../util/analytics";
import { SvgThemeImage, EnumImages } from "../Components/SvgThemeImage";

type Props = {
  applicationId: string;
};

const CLASS_NAME = "roles-tile";

const EVENT_DATA: TrackEvent = {
  eventName: "rolesTileClick",
};

function RolesTile({ applicationId }: Props) {
  const history = useHistory();

  const { data, loading } = useQuery<{
    appRoles: models.AppRole[];
  }>(GET_ROLES, {
    variables: {
      id: applicationId,
    },
  });
  const { trackEvent } = useTracking();

  const handleClick = useCallback(
    (event) => {
      trackEvent(EVENT_DATA);
      history.push(`/${applicationId}/roles`);
    },
    [history, trackEvent, applicationId]
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
              <Icon icon={{ icon: "lock", size: "medium" }} />

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
