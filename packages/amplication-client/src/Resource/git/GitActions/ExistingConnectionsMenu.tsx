import {
  EnumButtonStyle,
  Icon,
  Label,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/ui/design-system";
import { useRef } from "react";
import { GitOrganizationFromGitRepository } from "../ResourceGitSettingsPage";
import "./ExistingConnectionsMenu.scss";
import { GitOrganizationMenuItemContent } from "./GitOrganizationMenuItemContent";
import { useAppContext } from "../../../context/appContext";

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

  const { permissions } = useAppContext();

  const canCreateGitOrganization = permissions.canPerformTask("git.org.create");

  return (
    <>
      <div className={`${CLASS_NAME}__label-title`}>
        <Label text="Select Git Organization" />
      </div>
      <SelectMenu
        selectRef={selectRef}
        title={
          selectedGitOrganization?.name ? (
            <GitOrganizationMenuItemContent
              gitProvider={selectedGitOrganization.provider}
              gitOrganization={selectedGitOrganization}
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
                    gitProvider={gitOrganization.provider}
                    gitOrganization={gitOrganization}
                  />
                </SelectMenuItem>
              ))}
            </>
            {canCreateGitOrganization && (
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
            )}
          </SelectMenuList>
        </SelectMenuModal>
      </SelectMenu>
    </>
  );
}
