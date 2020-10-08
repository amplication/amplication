import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Drawer, DrawerContent } from "@rmwc/drawer";
import { useHistory } from "react-router-dom";
import { useApolloClient } from "@apollo/react-hooks";
import "@rmwc/drawer/styles";
import { Icon } from "@rmwc/icon";
import { isMobileOnly, isMacOs } from "react-device-detect";

import classNames from "classnames";
import { unsetToken } from "../authentication/authentication";
import logo from "../assets/logo.svg";
import { ReactComponent as LogoTextual } from "../assets/logo-textual.svg";
import "./MainLayout.scss";
import CommandPalette from "../CommandPalette/CommandPalette";
import MenuItem from "./MenuItem";

type Props = {
  children: React.ReactNode;
  className?: string;
};

function MainLayout({ children, className }: Props) {
  return (
    <div
      className={classNames("main-layout", className, {
        "main-layout--mobile": isMobileOnly,
      })}
    >
      {children}
    </div>
  );
}

type MenuProps = {
  render?: (expanded: boolean) => React.ReactNode;
};

const Menu = ({ render }: MenuProps) => {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const history = useHistory();

  const apolloClient = useApolloClient();

  const handleMenuClick = useCallback(() => {
    setMenuExpanded(!menuExpanded);
  }, [menuExpanded]);

  const handleSignOut = useCallback(() => {
    /**@todo: sign out on server */
    unsetToken();
    apolloClient.clearStore();

    history.replace("/");
  }, [history, apolloClient]);

  return (
    <Drawer
      className={classNames("main-layout__side", {
        "main-layout__side--expanded": menuExpanded,
      })}
    >
      <DrawerContent className="main-layout__side__content">
        <div className="logo-container">
          <Link to="/" className="logo-container__logo">
            <Icon icon={logo} />
            <LogoTextual />
          </Link>
        </div>

        <div className="menu-container">
          <CommandPalette
            trigger={
              <MenuItem
                title="Search"
                icon="search_v2"
                overrideTooltip={`Search (${isMacOs ? "⌘" : "Ctrl"}+Shift+P)`}
              />
            }
          />
          {render ? render(menuExpanded) : null}
        </div>
        <div className="bottom-menu-container">
          <div className="menu-collapse" onClick={handleMenuClick}>
            <button>
              <Icon icon="chevrons_right" />
            </button>
          </div>
          <MenuItem
            title="Sign Out"
            icon="log_out_menu"
            onClick={handleSignOut}
          />
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
