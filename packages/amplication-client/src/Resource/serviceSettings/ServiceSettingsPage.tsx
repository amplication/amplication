import React, { useContext } from "react";
import { match } from "react-router-dom";
import { AppContext } from "../../context/appContext";
import InnerTabLink from "../../Layout/InnerTabLink";
import PageContent from "../../Layout/PageContent";
import { AppRouteProps } from "../../routes/routesUtil";

type Props = AppRouteProps & {
  match: match<{ resource: string }>;
};

const ServiceSettingsPage: React.FC<Props> = ({ match, innerRoutes }) => {
  const { resource } = match.params;
  const pageTitle = "Resource settings";
  const { currentWorkspace, currentProject } = useContext(AppContext);

  return (
    <PageContent
      pageTitle={pageTitle}
      sideContent={
        <div>
          <div>
            <InnerTabLink
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${resource}/resourceSettings/update`}
              icon="settings"
            >
              General
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${resource}/resourceSettings/generationSettings/update`}
              icon="settings"
            >
              APIs & Admin UI
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${resource}/resourceSettings/directories/update`}
              icon="settings"
            >
              Base Directories
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${resource}/resourceSettings/db/update`}
              icon="settings"
            >
              Database
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${resource}/resourceSettings/auth/update`}
              icon="settings"
            >
              Authentication
            </InnerTabLink>
          </div>
          <div>
            <InnerTabLink
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${resource}/resourceSettings/api-tokens`}
              icon="id"
            >
              API Tokens
            </InnerTabLink>
          </div>
        </div>
      }
    >
      {innerRoutes}
      {/* <Snackbar open={Boolean(error)} message={errorMessage} /> */}
    </PageContent>
  );
};

export default ServiceSettingsPage;
