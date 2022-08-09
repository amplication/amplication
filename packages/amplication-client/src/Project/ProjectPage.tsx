import React from "react";
import ResourceList from "../Workspaces/ResourceList";
import "./ProjectPage.scss";
import ProjectSideBar from "./ProjectSideBar";
import { AppRouteProps } from "../routes/routesUtil";
import { match } from "react-router-dom";
import PageContent from "../Layout/PageContent";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};
const pageTitle = "Project";

const ProjectPage: React.FC<Props> = ({ innerRoutes, match, moduleClass }) => {
  return (
    <div className={moduleClass}>
      {match.isExact ? (
        <PageContent pageTitle={pageTitle} sideContent={<ProjectSideBar />}>
          <ResourceList />
        </PageContent>
      ) : (
        innerRoutes
      )}
    </div>
  );
};

export default ProjectPage;
