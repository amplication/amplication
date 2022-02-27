import React from "react";
import { GitOrganization } from "../../../models";
import { githubOrgImageUrl } from "../../../util/github";

type Props = {
  org: GitOrganization;
};
export const GitOrganizationMenuItemContent = ({ org }: Props) => {
  return (
    <>
      <img
        src={githubOrgImageUrl(org.name)}
        style={{ width: 24, height: 24, marginRight: 8 }}
        alt="Git organization"
      />
      {org.name}
    </>
  );
};
