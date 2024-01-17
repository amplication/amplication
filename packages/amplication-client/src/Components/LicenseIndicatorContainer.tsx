import { Children, FC, useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../context/appContext";
import { useStiggContext } from "@stigg/react-sdk";
import { BillingFeature } from "@amplication/util-billing-types";
import React from "react";
import { FeatureIndicator } from "./FeatureIndicator";
import "./FeatureIndicatorContainer.scss";
import { EnumTextColor, Icon } from "@amplication/ui/design-system";
import {
  EntitlementType,
  FeatureIndicatorPlacement,
  IconType,
  isPreviewPlan,
} from "./FeatureIndicatorContainer";
import { omit } from "lodash";

const CLASS_NAME = "license-indicator-container";
const defaultBlockedTooltipText = "Your plan doesn't include this feature.";
const serviceLicenseTooltipText =
  "Your current plan permits only one active Service. ";

export enum LicensedResourceType {
  Project = "Project",
  Service = "Service",
}

export type Props = {
  featureId?: BillingFeature;
  licensedResourceType?: LicensedResourceType;
  licensedTooltipText?: string;
  blockedTooltipText?: string;
  featureIndicatorPlacement?: FeatureIndicatorPlacement;
  reversePosition?: boolean;
  children?: React.ReactElement;
};

export const LicenseIndicatorContainer: FC<Props> = ({
  featureId,
  licensedResourceType,
  licensedTooltipText,
  blockedTooltipText = defaultBlockedTooltipText,
  featureIndicatorPlacement,
  reversePosition,
  children,
}) => {
  const { stigg } = useStiggContext();
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);
  const { subscription } = currentWorkspace;
  const subscriptionPlan = subscription?.subscriptionPlan;
  const status = subscription?.status;
  const currentProjectLicense = currentProject?.licensed ?? true;
  const currentServiceLicense = currentResource?.licensed ?? true;

  const icon = IconType.Lock;
  const entitlementType = EntitlementType.Boolean;

  const [disabled, setDisabled] = useState<boolean>(false);
  const [tooltipText, setTooltipText] = useState<string>(null);

  const hasBooleanAccessToBlockFeature = stigg.getBooleanEntitlement({
    featureId,
  }).hasAccess;

  useEffect(() => {
    // when billing is disabled
    if (!subscriptionPlan || !status) {
      setDisabled(false);
      return;
    }

    if (
      licensedResourceType &&
      licensedResourceType === LicensedResourceType.Project &&
      !currentProjectLicense
    ) {
      setDisabled(true);
      setTooltipText(licensedTooltipText);
      return;
    }

    if (
      licensedResourceType &&
      licensedResourceType === LicensedResourceType.Service &&
      !currentServiceLicense
    ) {
      setDisabled(true);
      setTooltipText(licensedTooltipText ?? serviceLicenseTooltipText);
      return;
    }

    // for cases where we don't have billing feature id (create entity, create field, etc.)
    if (!featureId) {
      setDisabled(false);
      return;
    }

    if (entitlementType === EntitlementType.Boolean) {
      setDisabled(hasBooleanAccessToBlockFeature); // for license indicator we want to disable when has access, for example "BlockBuild"
      setTooltipText(blockedTooltipText);
    }
  }, [
    featureId,
    hasBooleanAccessToBlockFeature,
    currentProjectLicense,
    currentServiceLicense,
    licensedResourceType,
    subscriptionPlan,
    status,
    entitlementType,
    licensedTooltipText,
    blockedTooltipText,
  ]);

  const linkText = useMemo(() => {
    if (isPreviewPlan(subscriptionPlan)) {
      return ""; // don't show the upgrade link when the plan is preview
    }

    return undefined; // in case of null, it falls back to the default link text
  }, [subscriptionPlan]);

  const renderProps = {
    disabled: disabled,
    reversePosition,
    icon,
  };

  return disabled ? (
    <div className={CLASS_NAME}>
      {Children.map(children, (child) => (
        <FeatureIndicator
          featureName={featureId}
          icon={IconType.Lock}
          text={tooltipText}
          linkText={linkText}
          element={
            featureIndicatorPlacement === FeatureIndicatorPlacement.Outside ? (
              <div
                className={`${CLASS_NAME}__children ${
                  reversePosition ? "reverse-position" : ""
                }`}
              >
                {React.cloneElement(child, omit(renderProps, "icon"))}{" "}
                <Icon
                  icon={IconType.Lock}
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
  ) : (
    children
  );
};
