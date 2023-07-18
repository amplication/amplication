import React from "react";
import { GitOrganizationFromGitRepository } from "../SyncWithGithubPage";
import "./GitOrganizationMenuItemContent.scss";

const CLASS_NAME = "menu-item-content";

type Props = {
  gitAvatar: string;
  gitOrganization: GitOrganizationFromGitRepository;
  isMenuTitle?: boolean;
};
export const GitOrganizationMenuItemContent = ({
  gitAvatar,
  gitOrganization: { name },
  isMenuTitle = false,
}: Props) => {
  return (
    <span className={`${CLASS_NAME}`}>
      <img src={gitAvatar} alt="Git organization" />
      <span className={`${CLASS_NAME}__text`}>
        {isMenuTitle ? `${name} connected` : name}
      </span>
    </span>
  );
};
