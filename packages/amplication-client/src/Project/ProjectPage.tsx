import React, { useContext } from "react";
import { AppContext } from "../context/appContext";
import ResourceList from "../Workspaces/ResourceList";
import "./ProjectPage.scss";
import ProjectSideBar from "./ProjectSideBar";

const CLASS_NAME = "project-page";

const ProjectPage = () => {
  const {currentProject} = useContext(AppContext)
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__sidebar`}>
        <div className={`${CLASS_NAME}__sidebar-content`}>
          <ProjectSideBar />
        </div>
      </div>
      <div className={`${CLASS_NAME}__content`}><ResourceList projectId={currentProject?.id} /></div>
    </div>
  );
}

export default ProjectPage;
