import React from "react";
import { Link } from "react-router-dom";
import { Drawer, DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import { Icon } from "@rmwc/icon";

import { MainMenu, BottomMenu } from "../util/teleporter";

import UserBadge from "../Components/UserBadge";
import logo from "../assets/logo.svg";
import "./MainLayout.scss";

type Props = {
  children: React.ReactNode;
};

function MainLayout({ children }: Props) {
  return (
    <div className="main-layout">
      <Drawer className="main-layout__side">
        <DrawerContent className="main-layout__side__content">
          <div className="logo-container">
            <Link to="/" className="logo-container__logo">
              <Icon icon={logo} />
            </Link>
          </div>
          <div className="menu-container">
            <MainMenu.Target /> {/*placeholder for the main menu */}
          </div>
          <div className="bottom-menu-container">
            <BottomMenu.Target /> {/*placeholder for the bottom menu */}
            <UserBadge />
          </div>
        </DrawerContent>
      </Drawer>
      <div className="main-layout__content">{children}</div>
    </div>
  );
}

export default MainLayout;
