import React, { useContext } from "react";
import { AppContext } from "../context/appContext";
import InnerTabLink from "../Layout/InnerTabLink";

import PageContent from "../Layout/PageContent";
import { AppRouteProps } from "../routes/routesUtil";

const CLASS_NAME = "project-settings";
const PAGE_TITLE = "Project Settings";
type Props = AppRouteProps;

const ProjectSettingsPage: React.FC<Props> = ({ innerRoutes }) => {
  const { currentWorkspace, currentProject } = useContext(AppContext);

  return (
    <PageContent
      pageTitle={PAGE_TITLE}
      className={CLASS_NAME}
      sideContent={
        <>
          <InnerTabLink
            to={`/${currentWorkspace?.id}/${currentProject?.id}/settings/general`}
            icon="settings"
          >
            General
          </InnerTabLink>
          <InnerTabLink
            to={`/${currentWorkspace?.id}/${currentProject?.id}/settings/git`}
            icon="pending_changes"
          >
            Git Provider
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
