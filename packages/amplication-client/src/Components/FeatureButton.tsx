import React, { useCallback, useContext } from "react";
import * as designSystem from "@amplication/ui/design-system";
import { useTracking, Event as TrackEvent } from "../util/analytics";
import { EnumSubscriptionPlan, EnumSubscriptionStatus } from "../models";
import { AppContext } from "../context/appContext";

export { EnumButtonStyle } from "@amplication/ui/design-system";

export type Props = designSystem.FeatureButtonProps & {
  eventData?: TrackEvent;
};

export const FeatureButton = ({
  eventData,
  onClick,
  usageLimit,
  currentUsage,
  ...rest
}: Props) => {
  const { currentWorkspace } = useContext(AppContext);
  const { subscription } = currentWorkspace;
  const { subscriptionPlan, status } = subscription;

  const { trackEvent } = useTracking();

  const handleClick = useCallback(
    (event) => {
      if (eventData) {
        trackEvent(eventData);
      }
      if (onClick) {
        onClick(event);
      }
    },
    [onClick, eventData, trackEvent]
  );

  const handleIsDisabled = useCallback(() => {
    return usageLimit && currentUsage && currentUsage >= usageLimit;
  }, [currentWorkspace, usageLimit, currentUsage]);

  const handleIcon = useCallback(() => {
    if (subscriptionPlan === EnumSubscriptionPlan.Free) {
      const handleIsDisabled =
        usageLimit && currentUsage && currentUsage >= usageLimit;
      if (handleIsDisabled) {
        return "lock";
      }
    }

    if (
      subscriptionPlan === EnumSubscriptionPlan.Enterprise &&
      status === EnumSubscriptionStatus.Trailing
    ) {
      return "dimond";
    }
  }, [
    currentWorkspace,
    usageLimit,
    currentUsage,
    subscriptionPlan,
    EnumSubscriptionStatus,
  ]);

  return (
    <designSystem.FeatureButton
      {...rest}
      onClick={handleClick}
      icon={handleIcon()}
      iconPosition={designSystem.EnumIconPosition.Right}
      disabled={handleIsDisabled()}
    />
  );
};
