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
  onAddBitbucketOrganization: () => void;
};

const CLASS_NAME = "git-organization-select-menu";

export default function ExistingConnectionsMenu({
  gitOrganizations,
  selectedGitOrganization,
  onAddGitOrganization,
  onSelectGitOrganization,
  onAddBitbucketOrganization,
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
          "Select git provider integration"
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
              <hr className={`${CLASS_NAME}__hr`} />
              <SelectMenuItem onSelectionChange={onAddGitOrganization}>
                <span>Add GitHub organization</span>
                <Icon
                  icon="plus"
                  className={`${CLASS_NAME}__add-icon`}
                  size="xsmall"
                />
              </SelectMenuItem>
              <SelectMenuItem onSelectionChange={onAddBitbucketOrganization}>
                <span>Add Bitbucket account</span>
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
