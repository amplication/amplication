import { useQuery } from "@apollo/client";
import { useCallback } from "react";
import { useAppContext } from "../../context/appContext";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { GET_CONTACT_US_LINK } from "../queries/workspaceQueries";

export const useContactUs = ({
  actionName,
  eventOriginLocation,
}: {
  actionName?: string;
  eventOriginLocation?: string;
}) => {
  const { currentWorkspace } = useAppContext();
  const { data } = useQuery(GET_CONTACT_US_LINK, {
    variables: { id: currentWorkspace.id },
  });

  const { trackEvent } = useTracking();

  const handleContactUsClick = useCallback(() => {
    window.open(data?.contactUsLink, "_blank");
    trackEvent({
      eventName: AnalyticsEventNames.ContactUsButtonClick,
      action: actionName,
      eventOriginLocation: eventOriginLocation,
    });
  }, [actionName, data?.contactUsLink, eventOriginLocation, trackEvent]);

  return {
    contactUsLink: data?.contactUsLink,
    handleContactUsClick,
  };
};
