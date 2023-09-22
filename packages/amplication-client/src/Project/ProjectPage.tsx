import React, { useContext } from "react";
import ResourceList from "../Workspaces/ResourceList";
import { AppRouteProps } from "../routes/routesUtil";
import { match } from "react-router-dom";
import "./ProjectPage.scss";
import useBreadcrumbs from "../Layout/useBreadcrumbs";
import PageContent from "../Layout/PageContent";
import { AppContext } from "../context/appContext";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};
const pageTitle = "Project";

const ProjectPage: React.FC<Props> = ({ innerRoutes, match, moduleClass }) => {
  const { currentProject } = useContext(AppContext);

  useBreadcrumbs(currentProject?.name, match.url);

  return match.isExact ? (
    <>
      <PageContent pageTitle={pageTitle} className={moduleClass}>
        <ResourceList />
      </PageContent>
    </>
  ) : (
    innerRoutes
  );
};

export default ProjectPage;
