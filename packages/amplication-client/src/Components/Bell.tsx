import MenuItem from "../Layout/MenuItem";
import React from "react";
import { Icon } from "@amplication/design-system";
import "./Bell.scss";

const CLASS_NAME = "dot-notification";

export const Bell = ({ unseenCount }) => {
  return (
    <MenuItem title="Notification" icon="bell">
      <Icon icon="bell" size="large" />
      {unseenCount > 0 ? <span className={CLASS_NAME} /> : null}
    </MenuItem>
  );
};
