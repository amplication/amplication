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
import { GitOrganizationFromGitRepository } from "../SyncWithGithubPage";
import "./ExistingConnectionsMenu.scss";
import { GitOrganizationMenuItemContent } from "./GitOrganizationMenuItemContent";
import * as models from "../../../models";
import { ENTER, ESC } from "../../../util/hotkeys";
import { useCallback, useRef } from "react";

export const gitLogoMap = {
  [models.EnumGitProvider.Bitbucket]: BitbucketLogo,
  [models.EnumGitProvider.Github]: GithubLogo,
};

type Props = {
  gitOrganizations: GitOrganizationFromGitRepository[];
  selectedGitOrganization: GitOrganizationFromGitRepository | null;
  onAddGitOrganization?: () => void;
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

  const handleKeyDownOnSelectGitOrganization = useCallback(
    (
      keyEvent: React.KeyboardEvent<HTMLAnchorElement>,
      gitOrganization: GitOrganizationFromGitRepository
    ) => {
      keyEvent.stopPropagation();
      if (keyEvent.key === ENTER && selectRef?.current) {
        onSelectGitOrganization && onSelectGitOrganization(gitOrganization);
        selectRef.current.open = false;
      }
    },
    [onSelectGitOrganization, selectRef]
  );

  const handleKeyDownOpenModal = useCallback(
    (event: React.KeyboardEvent<HTMLDetailsElement>) => {
      if (event.key === ENTER && selectRef?.current) {
        selectRef.current.open = true;
      } else if (event.key === ESC && selectRef?.current) {
        selectRef.current.open = false;
      }
    },
    [selectRef]
  );

  const handleOnAddGitOrganization = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === ENTER) {
        onAddGitOrganization && onAddGitOrganization();
      }
    },
    []
  );

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
        onKeyDown={handleKeyDownOpenModal}
      >
        <SelectMenuModal className={`${CLASS_NAME}__list`}>
          <SelectMenuList className={`${CLASS_NAME}__select-menu`}>
            <>
              {gitOrganizations.map((gitOrganization) => (
                <SelectMenuItem
                  tabIndex={0}
                  className={`${CLASS_NAME}__item`}
                  closeAfterSelectionChange
                  selected={selectedGitOrganization?.id === gitOrganization.id}
                  key={gitOrganization.id}
                  onSelectionChange={() => {
                    onSelectGitOrganization(gitOrganization);
                  }}
                  onKeyDown={(e) =>
                    handleKeyDownOnSelectGitOrganization(e, gitOrganization)
                  }
                >
                  <GitOrganizationMenuItemContent
                    gitAvatar={gitLogoMap[gitOrganization.provider]}
                    gitOrganization={gitOrganization}
                  />
                </SelectMenuItem>
              ))}
            </>
          </SelectMenuList>
          <div
            tabIndex={0}
            className={`${CLASS_NAME}__add-item`}
            onKeyDown={handleOnAddGitOrganization}
            onClick={() => {
              selectRef.current.firstChild.click();
              onAddGitOrganization && onAddGitOrganization();
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
