import React, { useContext, useEffect } from "react";
import { AppContext } from "../../context/appContext";
import InnerTabLink from "../../Layout/InnerTabLink";
import { useHistory } from "react-router-dom";
import { EnumResourceType } from "../../models";
import { useResourceBaseUrl } from "../../util/useResourceBaseUrl";

const CLASS_NAME = "service-settings";

// eslint-disable-next-line @typescript-eslint/ban-types
const ServiceSettingsPage: React.FC<{}> = () => {
  const { currentResource } = useContext(AppContext);

  const { baseUrl } = useResourceBaseUrl();

  const history = useHistory();
  const location = history.location;

  useEffect(() => {
    if (location.pathname === `${baseUrl}/settings`) {
      history.push(`${baseUrl}/settings/general`);
    }
  }, []);

  return (
    <div className={CLASS_NAME}>
      <InnerTabLink to={`${baseUrl}/settings/general`} icon="app-settings">
        General
      </InnerTabLink>
      <InnerTabLink
        to={`${baseUrl}/settings/resource-settings`}
        icon="app-settings"
      >
        Resource Configuration
      </InnerTabLink>
      {(currentResource.resourceType === EnumResourceType.Service ||
        currentResource.resourceType === EnumResourceType.ServiceTemplate) && (
        <>
          <InnerTabLink
            to={`${baseUrl}/settings/generationSettings`}
            icon="api"
          >
            APIs & Admin UI
          </InnerTabLink>
          <InnerTabLink to={`${baseUrl}/settings/directories`} icon="folder">
            Base Directories
          </InnerTabLink>
          <InnerTabLink to={`${baseUrl}/settings/authentication`} icon="unlock">
            Authentication Entity
          </InnerTabLink>
          <InnerTabLink
            to={`${baseUrl}/settings/code-generator-version`}
            icon="code"
          >
            Code Generator Version
          </InnerTabLink>
        </>
      )}
    </div>
  );
};

export default ServiceSettingsPage;
