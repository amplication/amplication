import React from "react";
import { match } from "react-router-dom";
import ResourceList from "../Workspaces/ResourceList";
import "./ProjectPage.scss";
import ProjectSideBar from "./ProjectSideBar";

type Props = {
  match: match<{
    workspace: string;
    project: string;
  }>;
  moduleClass: string;
  noduleName: string;
  // eslint-disable-next-line no-undef
  InnerRoutes: JSX.Element | undefined;
};

const CLASS_NAME = "project-page";

const ProjectPage: React.FC<Props> = ({ InnerRoutes, match }) => {
  return (
    <div className={CLASS_NAME}>
      {match.isExact ? (
        <>
          <div className={`${CLASS_NAME}__sidebar`}>
            <div className={`${CLASS_NAME}__sidebar-content`}>
              <ProjectSideBar />
            </div>
          </div>
          <div className={`${CLASS_NAME}__content`}>
            <ResourceList />
          </div>
        </>
      ) : (
        InnerRoutes
      )}
    </div>
  );
};

export default ProjectPage;
