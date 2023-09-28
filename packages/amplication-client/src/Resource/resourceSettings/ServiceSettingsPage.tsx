import React, { useContext } from "react";
import { AppContext } from "../../context/appContext";
import InnerTabLink from "../../Layout/InnerTabLink";
import { BillingFeature } from "../../util/BillingFeature";
import { useStiggContext } from "@stigg/react-sdk";

const CLASS_NAME = "service-settings";

// eslint-disable-next-line @typescript-eslint/ban-types
const ServiceSettingsPage: React.FC<{}> = () => {
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  const { stigg } = useStiggContext();
  const showCodeGeneratorVersion = stigg.getBooleanEntitlement({
    featureId: BillingFeature.ShowCodeGeneratorVersion,
  }).hasAccess;

  return (
    <div className={CLASS_NAME}>
      <InnerTabLink
        to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/settings/general`}
        icon="settings"
      >
        General
      </InnerTabLink>
      <InnerTabLink
        to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/settings/generationSettings`}
        icon="settings"
      >
        APIs & Admin UI
      </InnerTabLink>
      <InnerTabLink
        to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/settings/directories`}
        icon="folder"
      >
        Base Directories
      </InnerTabLink>
      <InnerTabLink
        to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/settings/authentication`}
        icon="settings"
      >
        Authentication Entity
      </InnerTabLink>
      <InnerTabLink
        to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/settings/api-tokens`}
        icon="id"
      >
        API Tokens
      </InnerTabLink>
      {showCodeGeneratorVersion && (
        <InnerTabLink
          to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/settings/code-generator-version`}
          icon="code"
        >
          Code Generator Version
        </InnerTabLink>
      )}
    </div>
  );
};

export default ServiceSettingsPage;
