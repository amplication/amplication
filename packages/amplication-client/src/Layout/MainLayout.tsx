import React from "react";
import { Link } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import { Drawer, DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import { Icon } from "@rmwc/icon";

import { MainMenu } from "../util/teleporter";

import useAuthenticated from "../authentication/use-authenticated";
import logo from "../assets/logo.svg";

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
      <Drawer className="main-layout__menu">
        {" "}
        <DrawerContent>
          <div className="logo-container">
            <Link to="/" className="logo-container__logo">
              <Icon icon={logo} />
            </Link>
          </div>
          <MainMenu.Target />
          {data && (
            <>
              {/* <img height={30} src={data.user.picture} /> */}
              <Link to="/me">
                <span>{data.me.account.firstName}</span>
              </Link>
            </>
          )}
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
