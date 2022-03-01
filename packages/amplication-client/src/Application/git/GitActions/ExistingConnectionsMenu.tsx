// import SelectMenu from "../SelectMenu/SelectMenu";
// import SelectMenuButton from "../SelectMenu/SelectMenuButton";
import {
  EnumButtonStyle,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/design-system";
import React from "react";
import { GitOrganization } from "../../../models";
import { GitOrganizationFromGitRepository } from "../SyncWithGithubPage";
import "./ExistingConnectionsMenu.scss";
import { GitOrganizationMenuItemContent } from "./GitOrganizationMenuItemContent";
type Props = {
  gitOrganizations: GitOrganizationFromGitRepository[];
  selectedGitOrganization: GitOrganizationFromGitRepository | null;
  onAddGitOrganization: () => void;
  onSelectGitOrganization: (organization: GitOrganization) => void;
};

const CLASS_NAME = "git-organization-select-menu";

export default function ExistingConnectionsMenu({
  gitOrganizations,
  selectedGitOrganization,
  onAddGitOrganization,
  onSelectGitOrganization,
}: Props) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <SelectMenu
          title={selectedGitOrganization?.name || "Select new organization"}
          buttonStyle={EnumButtonStyle.Primary}
          className={`${CLASS_NAME}__menu`}
        >
          <SelectMenuModal>
            <SelectMenuList>
              <>
                {gitOrganizations.map((organization) => (
                  <SelectMenuItem
                    closeAfterSelectionChange
                    selected={selectedGitOrganization?.id === organization.id}
                    key={organization.id}
                    onSelectionChange={() => {
                      onSelectGitOrganization(organization);
                    }}
                  >
                    <GitOrganizationMenuItemContent org={organization} />
                  </SelectMenuItem>
                ))}
                <div
                  style={{
                    backgroundColor: "#22273c",
                    borderBottom: "none",
                    width: "100%",
                    display: "flex",
                  }}
                  className="select-menu_item "
                >
                  <hr style={{ width: "100%" }} />
                </div>

                <SelectMenuItem
                  onSelectionChange={() => {
                    onAddGitOrganization();
                  }}
                >
                  <span>Add another organization</span>
                </SelectMenuItem>
              </>
            </SelectMenuList>
          </SelectMenuModal>
        </SelectMenu>
      </div>
    </div>
  );
}
