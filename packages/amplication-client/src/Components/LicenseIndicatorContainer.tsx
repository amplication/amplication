import { Children, FC, useContext, useEffect, useState } from "react";
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
} from "./FeatureIndicatorContainer";
import { omit } from "lodash";

const CLASS_NAME = "license-indicator-container";
const defaultBlockedTooltipText = "Your plan does not include this feature. ";

export type Props = {
  featureId?: BillingFeature;
  licensedTooltipText?: string;
  blockedTooltipText?: string;
  featureIndicatorPlacement?: FeatureIndicatorPlacement;
  reversePosition?: boolean;
  children?: React.ReactElement;
};

export const LicenseIndicatorContainer: FC<Props> = ({
  featureId,
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
  const currentResourceLicense = currentResource?.licensed ?? true;

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
    console.log({ currentProjectLicense, currentResourceLicense, disabled });

    if (!currentProjectLicense || !currentResourceLicense) {
      setDisabled(true);
      setTooltipText(licensedTooltipText);
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
    currentResourceLicense,
  ]);

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
