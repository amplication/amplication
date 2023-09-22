import React, { useContext } from "react";
import { AppRouteProps } from "../routes/routesUtil";
import { match } from "react-router-dom";
import useBreadcrumbs from "../Layout/useBreadcrumbs";
import PageContent from "../Layout/PageContent";
import ProjectList from "../Project/ProjectList";
import { AppContext } from "../context/appContext";
import ProjectEmptyState from "../Project/ProjectEmptyState";
import AddNewProject from "../Project/AddNewProject";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};
const pageTitle = "Workspace";

const WorkspacePage: React.FC<Props> = ({
  innerRoutes,
  match,
  moduleClass,
}) => {
  const { currentWorkspace, projectsList } = useContext(AppContext);

  useBreadcrumbs(currentWorkspace?.name, match.url);

  return match.isExact ? (
    <>
      <PageContent pageTitle={pageTitle} className={moduleClass}>
        <AddNewProject />
        {projectsList.length ? (
          <ProjectList
            projects={projectsList}
            workspaceId={currentWorkspace?.id}
          />
        ) : (
          <ProjectEmptyState />
        )}
      </PageContent>
    </>
  ) : (
    innerRoutes
  );
};

export default WorkspacePage;
