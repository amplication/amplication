// import SelectMenu from "../SelectMenu/SelectMenu";
// import SelectMenuButton from "../SelectMenu/SelectMenuButton";
import {
  EnumButtonStyle,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/design-system";
import React, { useState } from "react";
import { GitOrganization } from "../../../models";
import { GitOrganizationMenuItemContent } from "./GitOrganizationMenuItemContent";
import "./ExistingConnectionsMenu.scss";
type Props = {
  gitOrganizations: GitOrganization[];
  handleAuthWithGithubClick: any;
};

export default function ExistingConnectionsMenu(props: Props) {
  const { gitOrganizations, handleAuthWithGithubClick } = props;
  const [selectedOrgId, setSelectedOrgId] = useState<string>(
    gitOrganizations[0].id
  );
  const handleClick = (orgId: string) => {
    setSelectedOrgId(orgId);
  };
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span>Select organization:</span>
      <SelectMenu
        title={
          gitOrganizations.find((org) => org.id === selectedOrgId)?.name ||
          "No git organization selected"
        }
        // icon="chevron_down"
        buttonStyle={EnumButtonStyle.Primary}
      >
        <SelectMenuModal>
          <SelectMenuList>
            <>
              {gitOrganizations.map((org) => (
                <SelectMenuItem
                  selected={selectedOrgId === org.id}
                  key={org.id}
                  onSelectionChange={() => {
                    handleClick(org.id);
                  }}
                >
                  <GitOrganizationMenuItemContent org={org} />
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
                  handleAuthWithGithubClick();
                }}
              >
                <span>Add another organization</span>
              </SelectMenuItem>
            </>
          </SelectMenuList>
        </SelectMenuModal>
      </SelectMenu>
    </div>
  );
}
