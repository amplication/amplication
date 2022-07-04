import React from "react";

import "./SvgThemeImage.scss";

export enum EnumImages {
  Entities = "--image-entities",
  Roles = "--image-roles",
  SyncWithGitHub = "--image-sync-github",
  Commit = "--image-commit",
  NoChanges = "--image-no-changes",
  AddResource = "--image-add-resource",
  Relations = "--image-relations",
  ImportExcel = "--image-import-excel",
  DropExcel = "--image-drop-excel",
  MyResources = "--image-my-resources",
  Generating = "--image-generating",
}

type Props = {
  image: EnumImages;
};

export const SvgThemeImage = ({ image }: Props) => {
  return (
    <span
      className="svg-theme-image"
      style={{
        backgroundImage: `var(${image})`,
      }}
    />
  );
};
