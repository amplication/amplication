import React from "react";
import { githubOrganizationImageUrl } from "../../../util/github";
import { GitOrganizationFromGitRepository } from "../SyncWithGithubPage";
import "./GitOrganizationMenuItemContent.scss";
const CLASS_NAME = "menu-item-content";

type Props = {
  gitOrganization: GitOrganizationFromGitRepository;
};
export const GitOrganizationMenuItemContent = ({
  gitOrganization: { name },
}: Props) => {
  return (
    <>
      <img
        className={`${CLASS_NAME}`}
        src={githubOrganizationImageUrl(name)}
        alt="Git organization"
      />
      {name}
    </>
  );
};
