import MenuItem from "../Layout/MenuItem";
import React from "react";
import { Icon } from "@amplication/design-system";

export const Bell = ({ unseenCount }) => {
  return (
    <MenuItem title="Notification" icon="bell">
      <Icon icon="bell" size="large" />
      {unseenCount}
    </MenuItem>
  );
};
