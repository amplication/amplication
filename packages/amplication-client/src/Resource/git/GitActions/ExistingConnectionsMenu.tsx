import {
  EnumButtonStyle,
  Icon,
  Label,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/ui/design-system";
import { gitLogoMap } from "../git-provider-icon-map";
import { GitOrganizationFromGitRepository } from "../SyncWithGithubPage";
import "./ExistingConnectionsMenu.scss";
import { GitOrganizationMenuItemContent } from "./GitOrganizationMenuItemContent";
import { useRef } from "react";

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
            </>
          </SelectMenuList>
          <div
            className={`${CLASS_NAME}__add-item`}
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
