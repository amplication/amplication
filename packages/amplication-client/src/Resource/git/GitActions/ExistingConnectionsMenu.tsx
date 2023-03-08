import {
  EnumButtonStyle,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/design-system";
import { GitOrganizationFromGitRepository } from "../SyncWithGithubPage";
import "./ExistingConnectionsMenu.scss";
import { GitOrganizationMenuItemContent } from "./GitOrganizationMenuItemContent";
import * as models from "../../../models";
import { GitOrganizationMenuAddProvider } from "./GitOrganizationMenuAddProvider";

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
              {GIT_PROVIDERS.map((provider) => (
                <GitOrganizationMenuAddProvider
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
