import {
  EnumButtonStyle,
  Icon,
  Label,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/ui/design-system";
import { GIT_LOGO_MAP } from "../constants";
import { GitOrganizationFromGitRepository } from "../ResourceGitSettingsPage";
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
              gitAvatar={GIT_LOGO_MAP[selectedGitOrganization.provider]}
              gitOrganization={selectedGitOrganization}
              isMenuTitle
            />
          ) : (
            "select organization" // temporary
          )
        }
        buttonStyle={EnumButtonStyle.Outline}
        icon="chevron_down"
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
                    gitAvatar={GIT_LOGO_MAP[gitOrganization.provider]}
                    gitOrganization={gitOrganization}
                  />
                </SelectMenuItem>
              ))}
            </>
            <SelectMenuItem
              closeAfterSelectionChange
              selected={false}
              onSelectionChange={() => {
                onAddGitOrganization && onAddGitOrganization();
              }}
            >
              <div className={`${CLASS_NAME}__add-item`}>
                <Icon icon="plus" size="xsmall" />
                <span>Add Organization</span>
              </div>
            </SelectMenuItem>
          </SelectMenuList>
        </SelectMenuModal>
      </SelectMenu>
    </>
  );
}
