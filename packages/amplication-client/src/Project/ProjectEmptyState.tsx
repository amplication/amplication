import React from "react";
import "./ProjectEmptyState.scss";
import ProjectSideBar from "./ProjectSideBar";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import classNames from "classnames";

const ProjectEmptyState: React.FC<unknown> = () => {
  const moduleClass = "project-empty-state";
  return (
    <div className={classNames("amp-page-content", moduleClass)}>
      <div className={`amp-page-content__tabs`}>
        <ProjectSideBar />
      </div>
      <main className={`amp-page-content__main`}>
        <SvgThemeImage image={EnumImages.AddResource} />
        <div className={`${moduleClass}__empty-state__title`}>
          There are no projects to show
        </div>
      </main>
    </div>
  );
};

export default ProjectEmptyState;
