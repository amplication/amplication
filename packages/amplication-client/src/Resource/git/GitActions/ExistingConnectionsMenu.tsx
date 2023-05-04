import {
  EnumButtonStyle,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/ui/design-system";
import { GitOrganizationFromGitRepository } from "../SyncWithGithubPage";
import "./ExistingConnectionsMenu.scss";
import { GitOrganizationMenuItemContent } from "./GitOrganizationMenuItemContent";
import * as models from "../../../models";
import { GitOrganizationMenuAddProvider } from "./GitOrganizationMenuAddProvider";
import { ENTER, ESC } from "../../../util/hotkeys";
import { useCallback, useRef } from "react";

type Props = {
  gitOrganizations: GitOrganizationFromGitRepository[];
  selectedGitOrganization: GitOrganizationFromGitRepository | null;
  onAddGitOrganization: (provider: models.EnumGitProvider) => void;
  onSelectGitOrganization: (
    organization: GitOrganizationFromGitRepository
  ) => void;
};

const CLASS_NAME = "git-organization-select-menu";

const GIT_PROVIDERS: { provider: models.EnumGitProvider; label: string }[] = [
  { provider: models.EnumGitProvider.Github, label: "Add GitHub Organization" },
  // comment until we fully support Bitbucket
  // {
  //   provider: models.EnumGitProvider.Bitbucket,
  //   label: "Add BitBucket Account",
  // },
];

export default function ExistingConnectionsMenu({
  gitOrganizations,
  selectedGitOrganization,
  onAddGitOrganization,
  onSelectGitOrganization,
}: Props) {
  const selectMenuRef = useRef(null);

  const handleKeyDownOnSelectGitOrganization = useCallback(
    (
      keyEvent: React.KeyboardEvent<HTMLAnchorElement>,
      gitOrganization: GitOrganizationFromGitRepository
    ) => {
      keyEvent.stopPropagation();
      if (keyEvent.key === ENTER && selectMenuRef?.current) {
        onSelectGitOrganization && onSelectGitOrganization(gitOrganization);
        selectMenuRef.current.open = false;
      }
    },
    [onSelectGitOrganization, selectMenuRef]
  );

  const handleKeyDownOpenModal = useCallback(
    (event: React.KeyboardEvent<HTMLDetailsElement>) => {
      if (event.key === ENTER && selectMenuRef?.current) {
        selectMenuRef.current.open = true;
      } else if (event.key === ESC && selectMenuRef?.current) {
        selectMenuRef.current.open = false;
      }
    },
    [selectMenuRef]
  );

  return (
    <SelectMenu
      title={
        selectedGitOrganization?.name ? (
          <GitOrganizationMenuItemContent
            gitOrganization={selectedGitOrganization}
            isMenuTitle
          />
        ) : (
          "Select Git Provider"
        )
      }
      buttonStyle={EnumButtonStyle.Text}
      className={`${CLASS_NAME}__menu`}
      icon="chevron_down"
      onKeyDown={handleKeyDownOpenModal}
      ref={selectMenuRef}
    >
      <SelectMenuModal>
        <div className={`${CLASS_NAME}__select-menu`}>
          <SelectMenuList>
            <>
              {gitOrganizations.map((gitOrganization) => (
                <SelectMenuItem
                  tabIndex={-1}
                  closeAfterSelectionChange
                  selected={selectedGitOrganization?.id === gitOrganization.id}
                  key={gitOrganization.id}
                  onKeyDown={(e) =>
                    handleKeyDownOnSelectGitOrganization(e, gitOrganization)
                  }
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
              {GIT_PROVIDERS.map((provider) => (
                <GitOrganizationMenuAddProvider
                  key={provider.provider}
                  label={provider.label}
                  provider={provider.provider}
                  onAddGitOrganization={onAddGitOrganization}
                  className={CLASS_NAME}
                />
              ))}
            </>
          </SelectMenuList>
        </div>
      </SelectMenuModal>
    </SelectMenu>
  );
}
