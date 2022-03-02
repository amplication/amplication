import React from "react";
import { githubOrganizationImageUrl } from "../../../util/github";
import { GitOrganizationFromGitRepository } from "../SyncWithGithubPage";

type Props = {
  gitOrganization: GitOrganizationFromGitRepository;
};
export const GitOrganizationMenuItemContent = ({
  gitOrganization: { name },
}: Props) => {
  return (
    <>
      <img
        src={githubOrganizationImageUrl(name)}
        style={{ width: 24, height: 24, marginRight: 8 }}
        alt="Git organization"
      />
      {name}
    </>
  );
};
