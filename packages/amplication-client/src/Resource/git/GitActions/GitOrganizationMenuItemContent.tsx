import React from "react";
import { GitOrganizationFromGitRepository } from "../ResourceGitSettingsPage";
import "./GitOrganizationMenuItemContent.scss";
import * as models from "../../../models";
import GitProviderLogo from "../GitProviderLogo";

const CLASS_NAME = "menu-item-content";

type Props = {
  gitProvider: models.EnumGitProvider;
  gitOrganization: GitOrganizationFromGitRepository;
};
export const GitOrganizationMenuItemContent = ({
  gitProvider,
  gitOrganization: { name },
}: Props) => {
  return (
    <span className={`${CLASS_NAME}`}>
      <GitProviderLogo gitProvider={gitProvider} />
      <span className={`${CLASS_NAME}__text`}>{name}</span>
    </span>
  );
};
