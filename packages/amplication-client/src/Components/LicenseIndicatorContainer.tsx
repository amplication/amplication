import { Children, FC, useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../context/appContext";
import { useStiggContext } from "@stigg/react-sdk";
import { BillingFeature } from "@amplication/util-billing-types";
import React from "react";
import { FeatureIndicator } from "./FeatureIndicator";
import "./FeatureIndicatorContainer.scss";
import { IconType } from "./FeatureIndicatorContainer";

const CLASS_NAME = "license-indicator-container";
const DEFAULT_BLOCKED_TOOLTIP_TEXT = "Your plan doesn't include this feature.";
const SERVICE_LICENSE_TOOLTIP_TEXT =
  "You have reached the maximum number of services allowed. To continue using additional services, please upgrade your plan.";

const PROJECT_LICENSE_TOOLTIP_TEXT =
  "You have reached the maximum number of projects allowed. To continue using additional projects, please upgrade your plan.";

export enum LicensedResourceType {
  Workspace = "Workspace",
  Project = "Project",
  Service = "Service",
}

export type Props = {
  licensedResourceType: LicensedResourceType;
  blockByFeatureId?: BillingFeature;
  children?: React.ReactElement;
};

export const LicenseIndicatorContainer: FC<Props> = ({
  blockByFeatureId,
  licensedResourceType,
  children,
}) => {
  const { stigg } = useStiggContext();

  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  const subscriptionPlan = currentWorkspace?.subscription?.subscriptionPlan;

  const currentProjectLicensed = currentProject?.licensed ?? true;
  const currentServiceLicensed = currentResource?.licensed ?? true;

  const [disabled, setDisabled] = useState<boolean>(false);
  const [tooltipText, setTooltipText] = useState<string>(null);

  const isBlockedFeature =
    blockByFeatureId &&
    stigg.getBooleanEntitlement({
      featureId: blockByFeatureId,
    }).hasAccess;

  useEffect(() => {
    // when billing is disabled
    if (!subscriptionPlan) {
      setDisabled(false);
      return;
    }

    if (
      licensedResourceType === LicensedResourceType.Project &&
      !currentProjectLicensed
    ) {
      setDisabled(true);
      setTooltipText(PROJECT_LICENSE_TOOLTIP_TEXT);
      return;
    }

    if (
      licensedResourceType === LicensedResourceType.Service &&
      !currentServiceLicensed
    ) {
      setDisabled(true);
      setTooltipText(SERVICE_LICENSE_TOOLTIP_TEXT);
      return;
    }

    setDisabled(isBlockedFeature); // for license indicator we want to disable when has access, for example "BlockBuild"
    setTooltipText(DEFAULT_BLOCKED_TOOLTIP_TEXT);
  }, [
    blockByFeatureId,
    isBlockedFeature,
    currentProjectLicensed,
    currentServiceLicensed,
    licensedResourceType,
    subscriptionPlan,
  ]);

  const renderProps = {
    disabled: disabled,
    icon: IconType.Lock,
  };

  return disabled ? (
    <div className={CLASS_NAME}>
      {Children.map(children, (child) => (
        <FeatureIndicator
          featureName={blockByFeatureId}
          icon={IconType.Lock}
          textStart={tooltipText}
          element={React.cloneElement(child, renderProps)}
        />
      ))}
    </div>
  ) : (
    children
  );
};
