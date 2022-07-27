import React from "react";
import ResourceList from "../Workspaces/ResourceList";
import "./ProjectPage.scss";
import ProjectSideBar from "./ProjectSideBar";

type Props = {
  moduleClass: string;
  // eslint-disable-next-line no-undef
  InnerRoutes: JSX.Element | undefined;
};

const ProjectPage: React.FC<Props> = ({ InnerRoutes, moduleClass }) => (
  <div className={moduleClass}>
    {InnerRoutes}
    <div className={`${moduleClass}__sidebar`}>
      <div className={`${moduleClass}__sidebar-content`}>
        <ProjectSideBar />
      </div>
    </div>
    <div className={`${moduleClass}__content`}>
      <ResourceList />
    </div>
  </div>
);

export default ProjectPage;
