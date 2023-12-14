import {
  Children,
  FC,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { EnumSubscriptionPlan, EnumSubscriptionStatus } from "../models";
import { AppContext } from "../context/appContext";
import { useStiggContext } from "@stigg/react-sdk";
import { BillingFeature } from "@amplication/util-billing-types";
import React from "react";
import { FeatureIndicator } from "./FeatureIndicator";
import "./FeatureIndicatorContainer.scss";
import { omit } from "lodash";
import { EnumTextColor, Icon } from "@amplication/ui/design-system";

const CLASS_NAME = "with-feature-control";

export enum IconType {
  Lock = "locked",
  Diamond = "diamond",
}

export enum EntitlementType {
  Boolean = "boolean",
  Metered = "metered",
}

export enum FeatureIndicatorPlacement {
  Inside = "inside",
  Outside = "outside",
}

export type Props = {
  featureId: BillingFeature;
  entitlementType: EntitlementType;
  featureIndicatorPlacement?: FeatureIndicatorPlacement;
  disabled?: boolean;
  icon?: IconType | null;
  tooltipText?: string;
  children?: React.ReactElement;
  render?: (props: { disabled: boolean; icon?: IconType }) => ReactElement;
  reversePosition?: boolean;
};

export const FeatureIndicatorContainer: FC<Props> = ({
  featureId,
  entitlementType,
  featureIndicatorPlacement = FeatureIndicatorPlacement.Inside,
  disabled,
  children,
  tooltipText,
  render,
  reversePosition,
}) => {
  const { stigg } = useStiggContext();
  const { currentWorkspace } = useContext(AppContext);
  const { subscription } = currentWorkspace;
  const { subscriptionPlan, status } = subscription;

  const {
    usageLimit,
    currentUsage,
    hasAccess: hasMeteredAccess,
  } = stigg.getMeteredEntitlement({
    featureId,
  });

  const hasBooleanAccess = stigg.getBooleanEntitlement({
    featureId,
  }).hasAccess;

  const isFeatureDisabled = useCallback(() => {
    if (!featureId) {
      return false;
    }

    if (entitlementType === EntitlementType.Boolean) {
      return !hasBooleanAccess;
    }

    if (entitlementType === EntitlementType.Metered) {
      const usageExceeded = usageLimit && currentUsage >= usageLimit;
      return usageExceeded ?? !hasMeteredAccess;
    }

    return false;
  }, [featureId, usageLimit, currentUsage, hasMeteredAccess, hasBooleanAccess]);

  const iconType = useMemo(() => {
    if (!featureId) {
      return null;
    }
    if (subscriptionPlan === EnumSubscriptionPlan.Free && isFeatureDisabled()) {
      return IconType.Lock;
    }
    if (
      subscriptionPlan === EnumSubscriptionPlan.Enterprise &&
      status === EnumSubscriptionStatus.Trailing
    ) {
      return IconType.Diamond;
    }
  }, [featureId, subscriptionPlan, status, isFeatureDisabled]);

  const renderProps = {
    disabled: disabled ?? isFeatureDisabled(),
    icon: iconType,
    reversePosition,
  };

  return (
    <div className={CLASS_NAME}>
      {render && render(renderProps)}
      {!render &&
        iconType &&
        Children.map(children, (child) => (
          <FeatureIndicator
            featureName={featureId}
            icon={iconType}
            text={tooltipText}
            element={
              featureIndicatorPlacement ===
              FeatureIndicatorPlacement.Outside ? (
                <div
                  className={`${CLASS_NAME}__children ${
                    reversePosition ? "reverse-position" : ""
                  }`}
                >
                  {React.cloneElement(child, omit(renderProps, "icon"))}{" "}
                  <Icon
                    icon={iconType}
                    color={EnumTextColor.Black20}
                    size="xsmall"
                  />
                </div>
              ) : (
                React.cloneElement(child, renderProps)
              )
            }
          />
        ))}
      {!render && !iconType && children}
    </div>
  );
};
