import React, { useEffect } from "react";
import InnerTabLink from "../Layout/InnerTabLink";

import { useHistory } from "react-router-dom";
import PageContent from "../Layout/PageContent";
import { AppRouteProps } from "../routes/routesUtil";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import useBreadcrumbs from "../Layout/useBreadcrumbs";
import { match } from "react-router-dom";

const CLASS_NAME = "project-settings";
const PAGE_TITLE = "Project Settings";
type Props = AppRouteProps & {
  match: match<{
    projectId: string;
  }>;
};

const ProjectSettingsPage: React.FC<Props> = ({ innerRoutes, match }) => {
  const { baseUrl } = useProjectBaseUrl({ overrideIsPlatformConsole: false });

  useBreadcrumbs("Project Settings", match.url);
  const history = useHistory();
  const location = history.location;

  useEffect(() => {
    if (location.pathname === `${baseUrl}/settings`) {
      history.push(`${baseUrl}/settings/general`);
    }
  }, []);

  return (
    <PageContent
      pageTitle={PAGE_TITLE}
      className={CLASS_NAME}
      sideContent={
        <>
          <InnerTabLink to={`${baseUrl}/settings/general`} icon="app-settings">
            General
          </InnerTabLink>
          <InnerTabLink to={`${baseUrl}/settings/directories`} icon="folder">
            Base Directory
          </InnerTabLink>
          <InnerTabLink to={`${baseUrl}/settings/permissions`} icon="lock">
            Permissions
          </InnerTabLink>
        </>
      }
    >
      {innerRoutes}
    </PageContent>
  );
};

export default ProjectSettingsPage;
