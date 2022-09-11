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
  CreateServiceWizard = "--image-create-service-wizard",
  PLuginInstallationEmpty = "--plugin-installation-empty",
}

type Props = {
  image: EnumImages;
  css?: string;
};

export const SvgThemeImage = ({ image, css }: Props) => {
  return (
    <span
      className={css || "svg-theme-image"}
      style={{
        backgroundImage: `var(${image})`,
      }}
    />
  );
};
