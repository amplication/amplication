import React from "react";
import "./ProjectEmptyState.scss";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";

const CLASS_NAME = "project-empty-state";

const ProjectEmptyState: React.FC<unknown> = () => {
  return (
    <div className={CLASS_NAME}>
      <SvgThemeImage image={EnumImages.AddResource} />
      <div className={`${CLASS_NAME}__empty-state__title`}>
        There are no projects to show
      </div>
    </div>
  );
};

export default ProjectEmptyState;
