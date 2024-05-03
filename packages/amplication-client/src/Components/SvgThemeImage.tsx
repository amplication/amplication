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
  PluginInstallationEmpty = "--plugin-installation-empty",
  CommitEmptyState = "--image-commit-empty-state",
  CodeViewEmptyState = "--image-code-view-empty-state",
  MessageBrokerEmptyState = "--image-message-broker-empty-state",
  ImportPrismaSchema = "--image-import-prisma-schema",
  ImportPrisma = "--image-import-prisma",
}

export type Props = {
  image: EnumImages;
  className?: string;
};

export const SvgThemeImage = ({ image, className }: Props) => {
  return (
    <span
      className={className || "svg-theme-image"}
      style={{
        backgroundImage: `var(${image})`,
      }}
    />
  );
};
