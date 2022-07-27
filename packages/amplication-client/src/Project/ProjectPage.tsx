import React from "react";
import ResourceList from "../Workspaces/ResourceList";
import "./ProjectPage.scss";
import ProjectSideBar from "./ProjectSideBar";

const CLASS_NAME = "project-page";

const ProjectPage = () => (
  <div className={CLASS_NAME}>
    <div className={`${CLASS_NAME}__sidebar`}>
      <div className={`${CLASS_NAME}__sidebar-content`}>
        <ProjectSideBar />
      </div>
    </div>
    <div className={`${CLASS_NAME}__content`}>
      <ResourceList />
    </div>
  </div>
);

export default ProjectPage;
