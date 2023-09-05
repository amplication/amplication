import { useCallback, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";

import {
  CircularProgress,
  Button,
  EnumButtonStyle,
} from "@amplication/ui/design-system";

import { useTracking } from "../util/analytics";
import OverviewSecondaryTile from "./OverviewSecondaryTile";
import { AppContext } from "../context/appContext";
import { Resource } from "../models";
import { GET_MESSAGE_BROKER_CONNECTED_SERVICES } from "../Workspaces/queries/resourcesQueries";
import { AnalyticsEventNames } from "../util/analytics-events.types";

type Props = {
  resourceId: string;
};

function ServicesTile({ resourceId }: Props) {
  const history = useHistory();
  const { currentWorkspace, currentProject } = useContext(AppContext);
  const getResourceVars = { variables: { where: { id: resourceId } } };
  const { data, loading, refetch } = useQuery<{
    messageBrokerConnectedServices: Resource[];
  }>(GET_MESSAGE_BROKER_CONNECTED_SERVICES, getResourceVars);
  const { trackEvent } = useTracking();

  // eslint-disable-next-line
  useEffect(() => {
    refetch(getResourceVars);
  }, []);

  const handleClick = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.MessageBrokerConnectedServicesTileClick,
    });
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
            {data?.messageBrokerConnectedServices.length}
            {data && data?.messageBrokerConnectedServices.length > 1
              ? " services"
              : " service"}
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

export { ServicesTile };
