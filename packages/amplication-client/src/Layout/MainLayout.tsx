import React from "react";
import { Link } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import { Drawer, DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import { Icon } from "@rmwc/icon";
import { SideNav } from "@primer/components";

import { MainMenu, BottomMenu } from "../util/teleporter";

import useAuthenticated from "../authentication/use-authenticated";
import logo from "../assets/logo.svg";
import MenuItem from "./MenuItem";

import "./MainLayout.scss";

type TData = {
  me: {
    account: {
      firstName: string;
    };
  };
};

type Props = {
  children: React.ReactNode;
};

function MainLayout({ children }: Props) {
  const authenticated = useAuthenticated();
  const { data } = useQuery<TData>(GET_USER, {
    skip: !authenticated,
  });
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
            {data && (
              <SideNav className="side-nav">
                <MenuItem
                  title="User Settings"
                  to={`/me`}
                  icon="search"
                  className="app-icon"
                >
                  <span>{data.me.account.firstName}</span>
                </MenuItem>
              </SideNav>
            )}
          </div>
        </DrawerContent>
      </Drawer>
      <div className="main-layout__content">{children}</div>
    </div>
  );
}

export default MainLayout;

const GET_USER = gql`
  query getUser {
    me {
      account {
        firstName
      }
    }
  }
`;
