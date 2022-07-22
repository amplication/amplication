import React, { useContext } from "react";
import "./ProjectPage.scss";
import ProjectSideBar from "./ProjectSideBar";
import { AppContext } from "../context/appContext";

const CLASS_NAME = "project-page";

const ProjectPage = () => {
  const { currentWorkspace, projectsList } = useContext(AppContext);

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__sidebar`}>
        <div className={`${CLASS_NAME}__sidebar-content`}>
          <ProjectSideBar
            currentWorkspace={currentWorkspace}
            projectsList={projectsList}
          />
        </div>
      </div>
      <div className={`${CLASS_NAME}__content`}>content</div>
    </div>
  );
};

export default ProjectPage;
