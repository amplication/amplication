import React, { useContext, useEffect } from "react";
import { AppContext } from "../../context/appContext";
import InnerTabLink from "../../Layout/InnerTabLink";
import { BillingFeature } from "../../util/BillingFeature";
import { useStiggContext } from "@stigg/react-sdk";
import { useHistory } from "react-router-dom";

const CLASS_NAME = "service-settings";

// eslint-disable-next-line @typescript-eslint/ban-types
const ServiceSettingsPage: React.FC<{}> = () => {
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  const { stigg } = useStiggContext();
  const showCodeGeneratorVersion = stigg.getBooleanEntitlement({
    featureId: BillingFeature.ShowCodeGeneratorVersion,
  }).hasAccess;

  const history = useHistory();
  const location = history.location;

  useEffect(() => {
    if (
      location.pathname ===
      `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/settings`
    ) {
      history.push(
        `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/settings/general`
      );
    }
  }, []);

  return (
    <div className={CLASS_NAME}>
      <InnerTabLink
        to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/settings/general`}
        icon="app-settings"
      >
        General
      </InnerTabLink>
      <InnerTabLink
        to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/settings/generationSettings`}
        icon="api"
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
        icon="unlock"
      >
        Authentication Entity
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
