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
  meteredFeatureLength?: number;
  disabled?: boolean;
  icon?: IconType | null;
  children?: React.ReactElement;
  render?: (props: { disabled: boolean; icon?: IconType }) => ReactElement;
  reversePosition?: boolean;
};

export const FeatureControlContainer: FC<Props> = ({
  featureId,
  entitlementType,
  meteredFeatureLength,
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

  const isFeatureDisabled = useCallback(() => {
    if (!featureId) {
      return false;
    }

    if (entitlementType === EntitlementType.Boolean) {
      return !hasBooleanAccess;
    }

    const usageExceeded = usageLimit && meteredFeatureLength >= usageLimit;

    return usageExceeded ?? !hasMeteredAccess;
  }, [
    featureId,
    usageLimit,
    currentUsage,
    hasMeteredAccess,
    hasBooleanAccess,
    meteredFeatureLength,
  ]);

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
                <FeatureIndicator featureName={featureId} icon={iconType} />
              )}
            </div>
          ))}
    </div>
  );
};
