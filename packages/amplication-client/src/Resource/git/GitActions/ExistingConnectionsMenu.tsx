import {
  EnumButtonStyle,
  Icon,
  Label,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/ui/design-system";
import BitbucketLogo from "../../../assets/images/bitbucket.svg";
import GithubLogo from "../../../assets/images/github.svg";
import GitlabLogo from "../../../assets/images/gitlab.svg";
import { GitOrganizationFromGitRepository } from "../SyncWithGithubPage";
import "./ExistingConnectionsMenu.scss";
import { GitOrganizationMenuItemContent } from "./GitOrganizationMenuItemContent";
import * as models from "../../../models";
import { useRef } from "react";

export const gitLogoMap = {
  [models.EnumGitProvider.Bitbucket]: BitbucketLogo,
  [models.EnumGitProvider.Github]: GithubLogo,
  [models.EnumGitProvider.GitLab]: GitlabLogo,
};

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
  const selectRef = useRef(null);

  return (
    <>
      <div className={`${CLASS_NAME}__label-title`}>
        <Label text="Select organization" />
      </div>
      <SelectMenu
        selectRef={selectRef}
        title={
          selectedGitOrganization?.name ? (
            <GitOrganizationMenuItemContent
              gitAvatar={gitLogoMap[selectedGitOrganization.provider]}
              gitOrganization={selectedGitOrganization}
              isMenuTitle
            />
          ) : (
            "select organization" // temporary
          )
        }
        buttonStyle={EnumButtonStyle.Text}
        className={`${CLASS_NAME}__menu`}
        icon="chevron_down"
      >
        <SelectMenuModal className={`${CLASS_NAME}__list`}>
          <SelectMenuList className={`${CLASS_NAME}__select-menu`}>
            <>
              {gitOrganizations.map((gitOrganization) => (
                <SelectMenuItem
                  className={`${CLASS_NAME}__item`}
                  closeAfterSelectionChange
                  selected={selectedGitOrganization?.id === gitOrganization.id}
                  key={gitOrganization.id}
                  onSelectionChange={() => {
                    onSelectGitOrganization(gitOrganization);
                  }}
                >
                  <GitOrganizationMenuItemContent
                    gitAvatar={gitLogoMap[gitOrganization.provider]}
                    gitOrganization={gitOrganization}
                  />
                </SelectMenuItem>
              ))}
              {/* // <GitOrganizationMenuAddProvider
                  //   key={provider.provider}
                  //   label={provider.label}
                  //   provider={provider.provider}
                  //   onAddGitOrganization={onAddGitOrganization}
                  //   className={CLASS_NAME}
                  // /> */}
            </>
          </SelectMenuList>
          <div
            className={`${CLASS_NAME}__add-item`}
            onClick={() => {
              selectRef.current.firstChild.click();
              onAddGitOrganization();
            }}
          >
            <Icon icon="plus" size="xsmall" />
            <span>Add Organization</span>
          </div>
        </SelectMenuModal>
      </SelectMenu>
    </>
  );
}
