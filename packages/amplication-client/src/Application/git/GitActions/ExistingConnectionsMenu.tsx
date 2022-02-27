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
import "./ExistingConnectionsMenu.scss";
import { GitOrganizationMenuItemContent } from "./GitOrganizationMenuItemContent";
type Props = {
  gitOrganizations: GitOrganization[];
  selectedGitOrganization: GitOrganization | null;
  onAddGitOrganization: () => void;
  onSelectGitOrganization: (organization: GitOrganization) => void;
};

export default function ExistingConnectionsMenu({
  gitOrganizations,
  selectedGitOrganization,
  onAddGitOrganization,
  onSelectGitOrganization,
}: Props) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span>Select organization:</span>
        <SelectMenu
          title={selectedGitOrganization?.name || ""}
          buttonStyle={EnumButtonStyle.Primary}
        >
          <SelectMenuModal>
            <SelectMenuList>
              <>
                {gitOrganizations.map((organization) => (
                  <SelectMenuItem
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
