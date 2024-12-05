import React from "react";
import { GitOrganizationFromGitRepository } from "../ResourceGitSettingsPage";
import "./GitOrganizationMenuItemContent.scss";

const CLASS_NAME = "menu-item-content";

type Props = {
  gitAvatar: string;
  gitOrganization: GitOrganizationFromGitRepository;
};
export const GitOrganizationMenuItemContent = ({
  gitAvatar,
  gitOrganization: { name },
}: Props) => {
  return (
    <span className={`${CLASS_NAME}`}>
      <img src={gitAvatar} alt="Git organization" />
      <span className={`${CLASS_NAME}__text`}>{name}</span>
    </span>
  );
};
