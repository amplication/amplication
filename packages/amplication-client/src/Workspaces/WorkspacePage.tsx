import React, { useContext } from "react";
import { AppRouteProps } from "../routes/routesUtil";
import { match } from "react-router-dom";
import useBreadcrumbs from "../Layout/useBreadcrumbs";
import PageContent from "../Layout/PageContent";
import ProjectList from "../Project/ProjectList";
import { AppContext } from "../context/appContext";
import ProjectEmptyState from "../Project/ProjectEmptyState";
import AddNewProject from "../Project/AddNewProject";
import useTabRoutes from "../Layout/useTabRoutes";

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
  tabRoutes,
  tabRoutesDef,
}) => {
  const { currentWorkspace, projectsList } = useContext(AppContext);
  useBreadcrumbs(currentWorkspace?.name, match.url);

  const { tabs, currentRouteIsTab } = useTabRoutes(tabRoutesDef);

  const tabItems = [{ name: "Overview", url: match.url }, ...tabs];

  return (
    <>
      {match.isExact || currentRouteIsTab ? (
        <>
          <PageContent
            pageTitle={pageTitle}
            className={moduleClass}
            tabs={tabItems}
          >
            {match.isExact ? (
              <>
                <AddNewProject />
                {projectsList.length ? (
                  <ProjectList
                    projects={projectsList}
                    workspaceId={currentWorkspace?.id}
                  />
                ) : (
                  <ProjectEmptyState />
                )}
              </>
            ) : (
              tabRoutes
            )}
          </PageContent>
        </>
      ) : (
        innerRoutes
      )}
      ;
    </>
  );
};

export default WorkspacePage;
