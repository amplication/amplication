import {
  Children,
  FC,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { EnumSubscriptionPlan, EnumSubscriptionStatus } from "../models";
import { AppContext } from "../context/appContext";
import { useStiggContext } from "@stigg/react-sdk";
import { BillingFeature } from "@amplication/util-billing-types";
import React from "react";
import { FeatureIndicator, tooltipDefaultText } from "./FeatureIndicator";
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
  icon?: IconType | null;
  featureText?: string;
  fullEnterpriseText?: string;
  limitationText?: string;
  children?: React.ReactElement;
  render?: (props: { disabled: boolean; icon?: IconType }) => ReactElement;
  reversePosition?: boolean;
  showTooltip?: boolean;
};

export const FeatureIndicatorContainer: FC<Props> = ({
  featureId,
  entitlementType,
  featureIndicatorPlacement = FeatureIndicatorPlacement.Inside,
  children,
  featureText = tooltipDefaultText,
  limitationText,
  fullEnterpriseText,
  render,
  reversePosition,
  showTooltip = true,
}) => {
  const { stigg } = useStiggContext();
  const { currentWorkspace } = useContext(AppContext);
  const { subscription } = currentWorkspace;
  const subscriptionPlan = subscription?.subscriptionPlan;
  const status = subscription?.status;

  const [disabled, setDisabled] = useState<boolean>(false);
  const [icon, setIcon] = useState<IconType | null>(null);

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

  useEffect(() => {
    if (!subscriptionPlan || !status || !featureId) {
      setDisabled(false);
      setIcon(null);
      return;
    }

    if (entitlementType === EntitlementType.Boolean) {
      setDisabled(!hasBooleanAccess);
    }

    if (entitlementType === EntitlementType.Metered) {
      const usageExceeded = usageLimit && currentUsage >= usageLimit;
      const isDisabled = usageExceeded ?? !hasMeteredAccess;
      setDisabled(isDisabled);
    }
  }, [
    featureId,
    usageLimit,
    currentUsage,
    hasMeteredAccess,
    hasBooleanAccess,
    subscriptionPlan,
    status,
    entitlementType,
  ]);

  const text = useMemo(() => {
    if (disabled) {
      return limitationText;
    }
    if (subscription.status !== EnumSubscriptionStatus.Trailing) {
      return fullEnterpriseText;
    }

    return featureText;
  }, [disabled, featureText, subscription, limitationText]);

  const linkText = useMemo(() => {
    if (
      isPreviewPlan(subscriptionPlan) ||
      subscription.status !== EnumSubscriptionStatus.Trailing
    ) {
      return ""; // don't show the upgrade link when the plan is preview
    }

    return undefined; // in case of null, it falls back to the default link text
  }, [subscriptionPlan, subscription]);

  useEffect(() => {
    if (!subscriptionPlan || !status || !featureId) {
      setIcon(null);
      return;
    }
    if (
      (subscriptionPlan === EnumSubscriptionPlan.Free && disabled) ||
      (isPreviewPlan(subscriptionPlan) && disabled)
    ) {
      setIcon(IconType.Lock);
    }

    if (
      subscriptionPlan === EnumSubscriptionPlan.Enterprise &&
      status === EnumSubscriptionStatus.Trailing
    ) {
      setIcon(IconType.Diamond);
    }
  }, [featureId, subscriptionPlan, status, disabled]);

  const renderProps = {
    disabled: disabled,
    icon: icon,
    reversePosition,
  };

  return (
    <div className={CLASS_NAME}>
      {render && !showTooltip && render(renderProps)}
      {render && showTooltip && (
        <FeatureIndicator
          featureName={featureId}
          element={render(renderProps)}
          icon={icon}
          text={text}
          linkText={linkText}
        ></FeatureIndicator>
      )}
      {!render &&
        icon &&
        Children.map(children, (child) => (
          <FeatureIndicator
            featureName={featureId}
            icon={icon}
            text={text}
            linkText={linkText}
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
                    icon={icon}
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
      {!render && !icon && children}
    </div>
  );
};

export function isPreviewPlan(plan: EnumSubscriptionPlan) {
  const previewPlans = [EnumSubscriptionPlan.PreviewBreakTheMonolith];
  return previewPlans.includes(plan);
}
