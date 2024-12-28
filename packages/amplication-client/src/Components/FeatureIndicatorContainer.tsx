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
import {
  FeatureIndicator,
  DEFAULT_TEXT_END,
  DEFAULT_TEXT_START,
  DISABLED_DEFAULT_TEXT_END,
  EnumCtaType,
} from "./FeatureIndicator";
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
  fullEnterpriseText?: string;
  limitationText?: string;
  children?: React.ReactElement;
  render?: (props: { disabled: boolean; icon?: IconType }) => ReactElement;
  reversePosition?: boolean;
  showTooltip?: boolean;
  ctaType?: EnumCtaType;
  actualUsage?: number | null;
  paidPlansExclusive?: boolean;
};

export const FeatureIndicatorContainer: FC<Props> = ({
  featureId,
  entitlementType,
  featureIndicatorPlacement = FeatureIndicatorPlacement.Inside,
  children,
  limitationText,
  fullEnterpriseText,
  render,
  reversePosition,
  showTooltip = true,
  ctaType = EnumCtaType.Upgrade,
  actualUsage,
  paidPlansExclusive = true,
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
      const actualCurrentUsage =
        actualUsage !== null ? actualUsage : currentUsage;
      const usageExceeded = usageLimit && actualCurrentUsage >= usageLimit;
      const isDisabled = usageExceeded ?? !hasMeteredAccess;

      if (actualUsage !== null) {
        // do not consider metered access if actual usage is provided
        setDisabled(usageExceeded);
      } else setDisabled(isDisabled);
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
    actualUsage,
  ]);

  const textStart = useMemo(() => {
    if (disabled) {
      return limitationText;
    }
    if (
      (subscriptionPlan === EnumSubscriptionPlan.Enterprise ||
        subscriptionPlan === EnumSubscriptionPlan.Essential ||
        subscriptionPlan === EnumSubscriptionPlan.Team) &&
      status !== EnumSubscriptionStatus.Trailing
    ) {
      return fullEnterpriseText;
    }

    return DEFAULT_TEXT_START;
  }, [disabled, subscriptionPlan, status, limitationText, fullEnterpriseText]);

  const textEnd = useMemo(() => {
    if (disabled) {
      return DISABLED_DEFAULT_TEXT_END;
    }
    if (
      (subscriptionPlan === EnumSubscriptionPlan.Enterprise ||
        subscriptionPlan === EnumSubscriptionPlan.Essential ||
        subscriptionPlan === EnumSubscriptionPlan.Team) &&
      status !== EnumSubscriptionStatus.Trailing
    ) {
      return "";
    }

    return DEFAULT_TEXT_END;
  }, [disabled, subscriptionPlan, status]);

  const showTooltipLink = useMemo(() => {
    if (
      (subscriptionPlan === EnumSubscriptionPlan.Enterprise ||
        subscriptionPlan === EnumSubscriptionPlan.Essential ||
        subscriptionPlan === EnumSubscriptionPlan.Team) &&
      status !== EnumSubscriptionStatus.Trailing
    ) {
      return false; // don't show the upgrade link when the plan is preview
    }

    return true; // in case of null, it falls back to the default link text
  }, [subscriptionPlan, status]);

  useEffect(() => {
    if (!subscriptionPlan || !status || !featureId) {
      setIcon(null);
      return;
    }

    if (disabled) {
      setIcon(IconType.Lock);
    }

    if (
      (subscriptionPlan === EnumSubscriptionPlan.Enterprise ||
        subscriptionPlan === EnumSubscriptionPlan.Essential ||
        subscriptionPlan === EnumSubscriptionPlan.Team) &&
      status === EnumSubscriptionStatus.Trailing &&
      paidPlansExclusive
    ) {
      setIcon(IconType.Diamond);
    }
  }, [featureId, subscriptionPlan, status, disabled, paidPlansExclusive]);

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
          textStart={textStart}
          textEnd={textEnd}
          showTooltipLink={showTooltipLink}
          ctaType={ctaType}
        ></FeatureIndicator>
      )}
      {!render &&
        icon &&
        Children.map(children, (child) => (
          <FeatureIndicator
            featureName={featureId}
            icon={icon}
            textStart={textStart}
            textEnd={textEnd}
            showTooltipLink={showTooltipLink}
            ctaType={ctaType}
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
