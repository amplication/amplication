import React from "react";
import { MenuItem } from "./MenuItem";
import { Drawer, DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";

import classNames from "classnames";
import "./Menu.scss";

export type Props = {
  children?: React.ReactNode;
  bottomContent?: React.ReactNode;
  logoContent?: React.ReactNode;
  onSignOutClick: () => void;
};

export const Menu = ({
  children,
  bottomContent,
  logoContent,
  onSignOutClick,
}: Props) => {
  return (
    <Drawer className={classNames("amp-menu")}>
      <DrawerContent className="amp-menu__wrapper">
        <div className="amp-menu__wrapper__main-menu">
          <div className="logo-container">{logoContent}</div>

          <div className="menu-container">{children}</div>
          <div className="bottom-menu-container">
            {bottomContent}
            <MenuItem
              title="Sign Out"
              icon="log_out_outline"
              onClick={onSignOutClick}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
