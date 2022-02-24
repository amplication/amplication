import { Icon } from "@amplication/design-system";
import { Menu, MenuItem } from "@mui/material";
import React from "react";
import { GitOrganization } from "../../../models";
import Avatar, { AvatarSizeEnum } from "./Avatar";

type Props = {
  anchorEl: HTMLElement | null;
  handleClose: (
    event: any // React.MouseEventHandler<HTMLLIElement> | undefined
  ) => void;
  gitOrganizations: GitOrganization[];
};

export default function SelectMenu(props: Props) {
  const { anchorEl, handleClose, gitOrganizations } = props;
  const open = Boolean(anchorEl);

  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
      style={{ marginTop: 8 }}
    >
      {gitOrganizations.map((org) => (
        <MenuItem key={org.id} onClick={handleClose}>
          <Avatar
            src={`https://avatars.githubusercontent.com/${org.name}`}
            size={AvatarSizeEnum.small}
          />
          <span style={{ paddingLeft: "8px" }}>{org.name}</span>
          <Icon icon="check" />
        </MenuItem>
      ))}
    </Menu>
  );
}
