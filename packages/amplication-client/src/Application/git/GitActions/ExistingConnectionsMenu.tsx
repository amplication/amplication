import {
  EnumButtonStyle,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/design-system";
import React from "react";
import { GitOrganizationFromGitRepository } from "../SyncWithGithubPage";
import "./ExistingConnectionsMenu.scss";
import { GitOrganizationMenuItemContent } from "./GitOrganizationMenuItemContent";

type Props = {
  gitOrganizations: GitOrganizationFromGitRepository[];
  selectedGitOrganization: GitOrganizationFromGitRepository | null;
  onAddGitOrganization: () => void;
  onSelectGitOrganization: (
    organization: GitOrganizationFromGitRepository
  ) => void;
};

const CLASS_NAME = "git-organization-select-menu";

export default function ExistingConnectionsMenu({
  gitOrganizations,
  selectedGitOrganization,
  onAddGitOrganization,
  onSelectGitOrganization,
}: Props) {
  return (
    <SelectMenu
      title={selectedGitOrganization?.name || "Select new organization"}
      buttonStyle={EnumButtonStyle.Primary}
      className={`${CLASS_NAME}__menu`}
    >
      <SelectMenuModal>
        <SelectMenuList>
          <>
            {gitOrganizations.map((gitOrganization) => (
              <SelectMenuItem
                closeAfterSelectionChange
                selected={selectedGitOrganization?.id === gitOrganization.id}
                key={gitOrganization.id}
                onSelectionChange={() => {
                  onSelectGitOrganization(gitOrganization);
                }}
              >
                <GitOrganizationMenuItemContent
                  gitOrganization={gitOrganization}
                />
              </SelectMenuItem>
            ))}
            <div className={`select-menu_item ${CLASS_NAME}__hr`}>
              <hr />
            </div>

            <SelectMenuItem onSelectionChange={onAddGitOrganization}>
              <span>Add another organization</span>
            </SelectMenuItem>
          </>
        </SelectMenuList>
      </SelectMenuModal>
    </SelectMenu>
  );
}
