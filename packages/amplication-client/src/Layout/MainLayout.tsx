import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Drawer, DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import { Icon } from "@rmwc/icon";
import classNames from "classnames";

import logo from "../assets/logo.svg";
import "./MainLayout.scss";

type Props = {
  children: React.ReactNode;
};

function MainLayout({ children }: Props) {
  return <div className="main-layout">{children}</div>;
}

type MenuProps = {
  render?: (expanded: boolean) => React.ReactNode;
};

const Menu = ({ render }: MenuProps) => {
  const [menuExpanded, setMenuExpanded] = useState(false);

  const handleMenuClick = useCallback(() => {
    setMenuExpanded(!menuExpanded);
  }, [menuExpanded]);

  return (
    <Drawer
      className={classNames("main-layout__side", {
        "main-layout__side--expanded": menuExpanded,
      })}
    >
      <DrawerContent className="main-layout__side__content">
        <div className="logo-container">
          <div className="menu-collapse">
            <button onClick={handleMenuClick}>
              <Icon icon="menu" />
            </button>
          </div>
          <Link to="/" className="logo-container__logo">
            <Icon icon={logo} />
          </Link>
        </div>
        <div className="menu-container">
          {render ? render(menuExpanded) : null}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

MainLayout.Menu = Menu;

type ContentProps = {
  children?: React.ReactNode;
};

const Content = ({ children }: ContentProps) => {
  return <div className="main-layout__content">{children}</div>;
};

MainLayout.Content = Content;

export default MainLayout;
