import React, { useEffect } from "react";
import InnerTabLink from "../Layout/InnerTabLink";

import { useHistory } from "react-router-dom";
import PageContent from "../Layout/PageContent";
import { AppRouteProps } from "../routes/routesUtil";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";

const CLASS_NAME = "project-settings";
const PAGE_TITLE = "Project Settings";
type Props = AppRouteProps;

const ProjectPlatformSettingsPage: React.FC<Props> = ({ innerRoutes }) => {
  const { baseUrl } = useProjectBaseUrl();

  const history = useHistory();
  const location = history.location;

  useEffect(() => {
    if (location.pathname === `${baseUrl}/settings`) {
      history.push(`${baseUrl}/settings/access`);
    }
  }, []);

  return (
    <PageContent
      pageTitle={PAGE_TITLE}
      className={CLASS_NAME}
      sideContent={
        <>
          <InnerTabLink to={`${baseUrl}/settings/access`} icon="lock">
            Platform Access
          </InnerTabLink>
        </>
      }
    >
      {innerRoutes}
    </PageContent>
  );
};

export default ProjectPlatformSettingsPage;
