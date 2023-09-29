import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/appContext";
import InnerTabLink from "../Layout/InnerTabLink";

import PageContent from "../Layout/PageContent";
import { AppRouteProps } from "../routes/routesUtil";
import { useHistory } from "react-router-dom";

const CLASS_NAME = "project-settings";
const PAGE_TITLE = "Project Settings";
type Props = AppRouteProps;

const ProjectSettingsPage: React.FC<Props> = ({ innerRoutes }) => {
  const { currentWorkspace, currentProject } = useContext(AppContext);

  const history = useHistory();
  const location = history.location;

  useEffect(() => {
    if (
      location.pathname ===
      `/${currentWorkspace?.id}/${currentProject?.id}/settings`
    ) {
      history.push(
        `/${currentWorkspace?.id}/${currentProject?.id}/settings/general`
      );
    }
  }, []);

  return (
    <PageContent
      pageTitle={PAGE_TITLE}
      className={CLASS_NAME}
      sideContent={
        <>
          <InnerTabLink
            to={`/${currentWorkspace?.id}/${currentProject?.id}/settings/general`}
            icon="app-settings"
          >
            General
          </InnerTabLink>
          <InnerTabLink
            to={`/${currentWorkspace?.id}/${currentProject?.id}/settings/directories`}
            icon="folder"
          >
            Base Directory
          </InnerTabLink>
        </>
      }
    >
      {innerRoutes}
    </PageContent>
  );
};

export default ProjectSettingsPage;
