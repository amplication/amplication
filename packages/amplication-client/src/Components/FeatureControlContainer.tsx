import { Children, FC, ReactElement, useContext, useMemo } from "react";
import { EnumSubscriptionPlan, EnumSubscriptionStatus } from "../models";
import { AppContext } from "../context/appContext";
import { useStiggContext } from "@stigg/react-sdk";
import { BillingFeature } from "../util/BillingFeature";
import React from "react";
import { LockedFeatureIndicator } from "./LockedFeatureIndicator";
import "./FeatureControlContainer.scss";
import { omit } from "lodash";

const CLASS_NAME = "with-feature-control";

export enum IconType {
  Lock = "locked",
  Diamond = "diamond",
}

export enum EntitlementType {
  Boolean = "boolean",
  Metered = "metered",
}

export type Props = {
  featureId: BillingFeature;
  entitlementType: EntitlementType;
  disabled?: boolean;
  icon?: IconType | null;
  children?: React.ReactElement;
  render?: (props: { disabled: boolean; icon?: IconType }) => ReactElement;
  reversePosition?: boolean;
};

export const FeatureControlContainer: FC<Props> = ({
  featureId,
  entitlementType,
  disabled,
  children,
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

  const isFeatureDisabled = useMemo(() => {
    if (!featureId) {
      return null; // not disabled if no featureId is provided
    }

    if (entitlementType === EntitlementType.Boolean) {
      return !hasBooleanAccess;
    }

    const usageExceeded =
      usageLimit && currentUsage && currentUsage >= usageLimit;
    return usageExceeded ?? !hasMeteredAccess;
  }, [featureId, usageLimit, currentUsage, hasMeteredAccess, hasBooleanAccess]);

  const iconType = useMemo(() => {
    if (!featureId) {
      return null; // no icon if no featureId is provided
    }
    if (subscriptionPlan === EnumSubscriptionPlan.Free && isFeatureDisabled) {
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
    disabled: disabled ?? isFeatureDisabled,
    icon: iconType,
    reversePosition,
  };

  return (
    <div className={CLASS_NAME}>
      {render
        ? render(renderProps)
        : Children.map(children, (child) => (
            <div
              className={`${CLASS_NAME}__children ${
                reversePosition ? "reverse-position" : ""
              }`}
            >
              {React.cloneElement(child, omit(renderProps, "icon"))}
              {iconType && (
                <LockedFeatureIndicator
                  featureName={featureId}
                  infoIcon={iconType}
                />
              )}
            </div>
          ))}
    </div>
  );
};
