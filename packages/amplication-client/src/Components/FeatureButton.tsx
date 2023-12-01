import React, { useCallback, useContext } from "react";
import * as designSystem from "@amplication/ui/design-system";
import { useTracking, Event as TrackEvent } from "../util/analytics";
import { EnumSubscriptionPlan, EnumSubscriptionStatus } from "../models";
import { AppContext } from "../context/appContext";
import { Button, Props } from "./Button";

import withFeatureControl, {
  WithFeatureControlProps,
} from "./WithFeatureControl";

interface EnhancedButtonProps
  extends designSystem.ButtonProps,
    Props,
    WithFeatureControlProps {
  iconType?: "lock" | "dimond" | null;
}

const FeatureButton = ({ iconType, ...props }: EnhancedButtonProps) => {
  const renderIcon = () => {
    switch (iconType) {
      case "lock":
        return "lock";
      case "dimond":
        return "dimond";
      default:
        return null;
    }
  };
  return (
    <Button
      {...props}
      icon={renderIcon()}
      iconPosition={designSystem.EnumIconPosition.Right}
    />
  );
};

export const EnhancedFeatureButton = withFeatureControl(FeatureButton);

// export { EnumButtonStyle } from "@amplication/ui/design-system";

// export type Props = designSystem.FeatureButtonProps & {
//   eventData?: TrackEvent;
// };

// export const FeatureButton = ({
//   eventData,
//   onClick,
//   disabled,
//   usageLimit,
//   currentUsage,
//   ...rest
// }: Props) => {
//   const { currentWorkspace } = useContext(AppContext);
//   const { subscription } = currentWorkspace;
//   const { subscriptionPlan, status } = subscription;

//   const { trackEvent } = useTracking();

//   const handleClick = useCallback(
//     (event) => {
//       if (eventData) {
//         trackEvent(eventData);
//       }
//       if (onClick) {
//         onClick(event);
//       }
//     },
//     [onClick, eventData, trackEvent]
//   );

//   const handleIsDisabled = useCallback(() => {
//     return usageLimit && currentUsage && currentUsage >= usageLimit;
//   }, [currentWorkspace, usageLimit, currentUsage]);

//   const handleIcon = useCallback(() => {
//     if (subscriptionPlan === EnumSubscriptionPlan.Free) {
//       const handleIsDisabled =
//         usageLimit && currentUsage && currentUsage >= usageLimit;
//       if (handleIsDisabled) {
//         return "lock";
//       }
//     }

//     if (
//       subscriptionPlan === EnumSubscriptionPlan.Enterprise &&
//       status === EnumSubscriptionStatus.Trailing
//     ) {
//       return "dimond";
//     }
//   }, [
//     currentWorkspace,
//     usageLimit,
//     currentUsage,
//     subscriptionPlan,
//     EnumSubscriptionStatus,
//   ]);

//   return (
//     <designSystem.FeatureButton
//       {...rest}
//       onClick={handleClick}
//       icon={handleIcon()}
//       iconPosition={designSystem.EnumIconPosition.Right}
//       disabled={disabled || handleIsDisabled()}
//     />
//   );
// };
