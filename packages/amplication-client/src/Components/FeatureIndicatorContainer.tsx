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
  meteredFeatureLength?: number;
  disabled?: boolean;
  icon?: IconType | null;
  children?: React.ReactElement;
  render?: (props: { disabled: boolean; icon?: IconType }) => ReactElement;
  reversePosition?: boolean;
};

export const FeatureIndicatorContainer: FC<Props> = ({
  featureId,
  entitlementType,
  featureIndicatorPlacement = FeatureIndicatorPlacement.Inside,
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

    const usageExceeded =
      usageLimit && meteredFeatureLength && meteredFeatureLength >= usageLimit;

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
            <FeatureIndicator
              featureName={featureId}
              icon={iconType}
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
    </div>
  );
};
