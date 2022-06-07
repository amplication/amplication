import React, { useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import { isMobileOnly, isMacOs } from "react-device-detect";

import classNames from "classnames";
import { unsetToken } from "../authentication/authentication";
import { ReactComponent as LogoTextual } from "../assets/logo-textual.svg";
import CommandPalette from "../CommandPalette/CommandPalette";
import MenuItem from "./MenuItem";
import UserBadge from "../Components/UserBadge";
import { FixedMenuPanel } from "../util/teleporter";
import { Popover, Icon } from "@amplication/design-system";
import SupportMenu from "./SupportMenu";
import { useTracking } from "../util/analytics";
import DarkModeToggle from "./DarkModeToggle";
import "./MainLayout.scss";

type Props = {
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};
const CLASS_NAME = "main-layout";

function MainLayout({ children, footer, className }: Props) {
  return (
    <div
      className={classNames(CLASS_NAME, className, {
        [`${CLASS_NAME}--mobile`]: isMobileOnly,
      })}
    >
      <div className={`${CLASS_NAME}__wrapper`}>{children}</div>
      {footer && <div className={`${CLASS_NAME}__footer`}>{footer}</div>}
    </div>
  );
}

type MenuProps = {
  children?: React.ReactNode;
};

const Menu = ({ children }: MenuProps) => {
  const history = useHistory();
  const { trackEvent } = useTracking();

  const apolloClient = useApolloClient();

  const handleProfileClick = useCallback(() => {
    history.push("/user/profile");
  }, [history]);

  const handleSignOut = useCallback(() => {
    /**@todo: sign out on server */
    unsetToken();
    apolloClient.clearStore();

    history.replace("/");
  }, [history, apolloClient]);

  const handleSupportClick = useCallback(() => {
    trackEvent({
      eventName: "supportButtonClick",
    });
  }, [trackEvent]);

  return (
    <div className={classNames("main-layout__menu")}>
      <div className="main-layout__menu__wrapper">
        <div className="main-layout__menu__wrapper__main-menu">
          <div className="logo-container">
            <Link to="/" className="logo-container__logo">
              <Icon icon="logo" className="main-logo" />
              <LogoTextual />
            </Link>
          </div>

          <div className="menu-container">
            <CommandPalette
              trigger={
                <MenuItem
                  title="Search"
                  icon="search_outline"
                  overrideTooltip={`Search (${isMacOs ? "⌘" : "Ctrl"}+Shift+P)`}
                />
              }
            />
            {children}
          </div>
          <div className="bottom-menu-container">
            <DarkModeToggle />
            <Popover
              className="main-layout__menu__popover"
              content={<SupportMenu />}
              onOpen={handleSupportClick}
              placement="right"
            >
              <MenuItem
                icon="help_outline"
                hideTooltip
                title="Help and support"
              />
            </Popover>
            <MenuItem
              title="Profile"
              icon="plus"
              hideTooltip
              onClick={handleProfileClick}>
              <UserBadge />
            </MenuItem>
            <MenuItem
              title="Sign Out"
              icon="log_out_outline"
              onClick={handleSignOut}
            />
          </div>
        </div>
        <FixedMenuPanel.Target className="main-layout__menu__wrapper__menu-fixed-panel" />
      </div>
    </div>
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

type AsideProps = {
  children?: React.ReactNode;
};

const Aside = ({ children }: AsideProps) => {
  return <div className="main-layout__aside">{children}</div>;
};

MainLayout.Aside = Aside;

export default MainLayout;
