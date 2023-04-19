import {
  EnumButtonStyle,
  Icon,
  Label,
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
    <>
      <div className={`${CLASS_NAME}__label-title`}>
        <Label text="Select organization" />
      </div>
      <SelectMenu
        title={
          selectedGitOrganization?.name ? (
            <GitOrganizationMenuItemContent
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
        <SelectMenuModal>
          <div className={`${CLASS_NAME}__select-menu`}>
            <SelectMenuList>
              <>
                {gitOrganizations.map((gitOrganization) => (
                  <SelectMenuItem
                    closeAfterSelectionChange
                    selected={
                      selectedGitOrganization?.id === gitOrganization.id
                    }
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
                  <span>Add Organization</span>
                  <Icon icon="plus" size="xsmall" />
                </SelectMenuItem>
                {/* // <GitOrganizationMenuAddProvider
                  //   key={provider.provider}
                  //   label={provider.label}
                  //   provider={provider.provider}
                  //   onAddGitOrganization={onAddGitOrganization}
                  //   className={CLASS_NAME}
                  // /> */}
              </>
            </SelectMenuList>
          </div>
        </SelectMenuModal>
      </SelectMenu>
    </>
  );
}
