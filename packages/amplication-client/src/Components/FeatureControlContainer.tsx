import { FC, ReactElement, useContext, useMemo } from "react";
import { EnumSubscriptionPlan, EnumSubscriptionStatus } from "../models";
import { AppContext } from "../context/appContext";
import { useStiggContext } from "@stigg/react-sdk";
import { BillingFeature } from "../util/BillingFeature";
import React from "react";

const CLASS_NAME = "with-feature-control";

export type Props = {
  featureId: BillingFeature;
  entitlementType: "boolean" | "metered";
  disabled?: boolean;
  icon?: "lock" | "diamond" | null;
  children?: React.ReactElement;
  render?: (props: { disabled: boolean; icon?: string }) => ReactElement;
};

export const FeatureControlContainer: FC<Props> = ({
  featureId,
  entitlementType,
  children,
  render,
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

    if (entitlementType === "boolean") {
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
      return "lock";
    }
    if (
      subscriptionPlan === EnumSubscriptionPlan.Enterprise &&
      status === EnumSubscriptionStatus.Trailing
    ) {
      return "diamond";
    }
  }, [featureId, subscriptionPlan, status, isFeatureDisabled]);

  const renderProps = {
    disabled: isFeatureDisabled,
    icon: iconType,
  };

  return (
    <div className={CLASS_NAME}>
      {render ? render(renderProps) : React.cloneElement(children, renderProps)}
    </div>
  );
};
