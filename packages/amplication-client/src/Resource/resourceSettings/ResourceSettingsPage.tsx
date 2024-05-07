import React from "react";
import PageContent from "../../Layout/PageContent";
import { AppRouteProps } from "../../routes/routesUtil";
import ServiceSettingsPage from "./ServiceSettingsPage";

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = AppRouteProps & {};

const PAGE_TITLE = "Settings";

const ResourceSettingsPage: React.FC<Props> = ({ innerRoutes }) => {
  return (
    <PageContent pageTitle={PAGE_TITLE} sideContent={<ServiceSettingsPage />}>
      {innerRoutes}
    </PageContent>
  );
};

export default ResourceSettingsPage;
