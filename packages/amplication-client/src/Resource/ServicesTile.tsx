import React, { useCallback, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import {
  CircularProgress,
  Button,
  EnumButtonStyle,
} from "@amplication/design-system";

import { useTracking, Event as TrackEvent } from "../util/analytics";
import OverviewSecondaryTile from "./OverviewSecondaryTile";
import { AppContext } from "../context/appContext";
import { Resource } from "../models";

type Props = {
  resourceId: string;
};

const EVENT_DATA: TrackEvent = {
  eventName: "rolesTileClick",
};

function ServicesTile({ resourceId }: Props) {
  const history = useHistory();
  const { currentWorkspace, currentProject } = useContext(AppContext);
  const getResourceVars = { variables: { id: resourceId } };
  const { data, loading, refetch } = useQuery<{ resource: Resource }>(GET_RESOURCE, getResourceVars);
  const { trackEvent } = useTracking();

  useEffect(() => { refetch(getResourceVars) });

  const handleClick = useCallback(() => {
    trackEvent(EVENT_DATA);
    history.push(
      `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/services`
    );
  }, [history, trackEvent, resourceId, currentWorkspace, currentProject]);

  return (
    <OverviewSecondaryTile
      icon="services_outline"
      title="Services"
      headerExtra={
        loading ? (
          <CircularProgress centerToParent />
        ) : (
          <>
            {data?.resource.services.length}
            {data && data?.resource.services.length > 1 ? " services" : " service"}
          </>
        )
      }
      message="See connected services."
      footer={
        <Button
          buttonStyle={EnumButtonStyle.Secondary}
          type="button"
          onClick={handleClick}
        >
          Go to services
        </Button>
      }
    />
  );
}

const GET_RESOURCE = gql`
  query resource($id: String!) {
    resource(where: { id: $id }) {
      id
      name
      description
      services {
        id
        name
        description
      }
      createdAt
      updatedAt
    }
  }
`;

export { ServicesTile };
