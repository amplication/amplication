import React from "react";
import "./ProjectEmptyState.scss";
import ProjectSideBar from "./ProjectSideBar";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";

const ProjectEmptyState: React.FC<{}> = () => {
  const moduleClass = "project-empty-state";
  return (
    <div className={moduleClass}>
      <div className={`${moduleClass}__sidebar`}>
        <div className={`${moduleClass}__sidebar-content`}>
          <ProjectSideBar />
        </div>
      </div>
      <div className={`${moduleClass}__content`}>
        <SvgThemeImage image={EnumImages.AddResource} />
        <div className={`${moduleClass}__empty-state__title`}>
          There are no projects to show
        </div>
      </div>
    </div>
  );
};

export default ProjectEmptyState;
