import {
  EnumButtonStyle,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Icon,
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
      title={
        selectedGitOrganization?.name ? (
          <GitOrganizationMenuItemContent
            gitOrganization={selectedGitOrganization}
            isMenuTitle
          />
        ) : (
          "Select new organization"
        )
      }
      buttonStyle={EnumButtonStyle.Text}
      className={`${CLASS_NAME}__menu`}
      icon="chevron_down"
    >
      <SelectMenuModal>
        <div className={`${CLASS_NAME}__select-menu`}>
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
                <Icon
                  icon="plus"
                  className={`${CLASS_NAME}__add-icon`}
                  size="xsmall"
                />
              </SelectMenuItem>
            </>
          </SelectMenuList>
        </div>
      </SelectMenuModal>
    </SelectMenu>
  );
}
