import { Icon } from "@amplication/ui/design-system";
import { ComponentType, useCallback, useContext } from "react";
import { EnumSubscriptionPlan, EnumSubscriptionStatus } from "../models";
import { AppContext } from "../context/appContext";
import { useStiggContext } from "@stigg/react-sdk";
import { BillingFeature } from "../util/BillingFeature";

const CLASS_NAME = "with-feature-control";

export interface WithFeatureControlProps {
  featureId?: BillingFeature;
  disabled?: boolean;
  showIcon?: boolean;
  iconType?: "lock" | "dimond" | null;
}
const withFeatureControl = <P extends WithFeatureControlProps>(
  WrappedComponent: ComponentType<P>
) => {
  return ({ featureId, disabled = false, showIcon = true, ...props }: P) => {
    const { stigg } = useStiggContext();
    const { currentWorkspace } = useContext(AppContext);
    const { subscription } = currentWorkspace;
    const { subscriptionPlan, status } = subscription;

    const { usageLimit, currentUsage } = stigg.getMeteredEntitlement({
      featureId,
    });

    const hasAccess = stigg.getBooleanEntitlement({
      featureId,
    }).hasAccess;

    const handleIcon = useCallback(() => {
      if (!featureId) return null;
      if (subscriptionPlan === EnumSubscriptionPlan.Free) {
        const handleIsDisabled =
          (usageLimit && currentUsage && currentUsage >= usageLimit) ||
          !hasAccess;
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
      featureId,
      usageLimit,
      currentUsage,
      subscriptionPlan,
      EnumSubscriptionStatus,
    ]);

    const EnhancedComponent = () => (
      <div className={CLASS_NAME}>
        <WrappedComponent
          {...(props as P)}
          disabled={disabled || handleIcon() === "lock"}
          iconType={handleIcon()}
        />
        {showIcon && <Icon icon={handleIcon()} />}
      </div>
    );

    return <EnhancedComponent />;
  };
};

export default withFeatureControl;
