import React from "react";
import ResourceList from "../Workspaces/ResourceList";
import ProjectSideBar from "./ProjectSideBar";
import { AppRouteProps } from "../routes/routesUtil";
import { match } from "react-router-dom";
import classNames from "classnames";
import { Helmet } from "react-helmet";
import "./ProjectPage.scss";

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
        <>
          <Helmet>
            <title>{`Amplication${pageTitle ? ` | ${pageTitle}` : ""}`}</title>
          </Helmet>
          <div className={classNames("amp-page-content", moduleClass)}>
            <div className={`amp-page-content__tabs`}>
              <ProjectSideBar />
            </div>
            <main className={`amp-page-content__main`}>
              <ResourceList />
            </main>
          </div>
        </>
      ) : (
        innerRoutes
      )}
    </div>
  );
};

export default ProjectPage;
