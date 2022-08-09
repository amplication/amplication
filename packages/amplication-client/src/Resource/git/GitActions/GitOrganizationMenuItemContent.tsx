import React from "react";
import { githubOrganizationImageUrl } from "../../../util/github";
import { GitOrganizationFromGitRepository } from "../SyncWithGithubPage";
import "./GitOrganizationMenuItemContent.scss";
const CLASS_NAME = "menu-item-content";

type Props = {
  gitOrganization: GitOrganizationFromGitRepository;
  isMenuTitle?: Boolean;
};
export const GitOrganizationMenuItemContent = ({
  gitOrganization: { name },
  isMenuTitle = false,
}: Props) => {
  return (
    <span className={`${CLASS_NAME}`}>
      <img src={githubOrganizationImageUrl(name)} alt="Git organization" />
      {isMenuTitle ? `${name} connected` : name}
    </span>
  );
};
