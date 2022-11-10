import React, { useContext } from "react";
import { AppContext } from "../../context/appContext";
import PageContent from "../../Layout/PageContent";
import { EnumResourceType } from "../../models";
import { AppRouteProps } from "../../routes/routesUtil";
import ProjectConfigurationSettingsPage from "./ProjectConfigurationSettingsPage";
import ServiceSettingsPage from "./ServiceSettingsPage";

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = AppRouteProps & {};

const ResourceSettingsPage: React.FC<Props> = ({ innerRoutes }) => {
  const { currentResource } = useContext(AppContext);
  const pageTitle =
    currentResource?.resourceType === EnumResourceType.Service
      ? "Service settings"
      : "Resource settings";

  return (
    <PageContent
      pageTitle={pageTitle}
      sideContent={
        currentResource?.resourceType === EnumResourceType.Service ? (
          <ServiceSettingsPage />
        ) : (
          <ProjectConfigurationSettingsPage />
        )
      }
    >
      {innerRoutes}
      {/* <Snackbar open={Boolean(error)} message={errorMessage} /> */}
    </PageContent>
  );
};

export default ResourceSettingsPage;
