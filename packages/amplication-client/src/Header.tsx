import React from "react";
import { Link } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
  TopAppBarActionItem,
} from "@rmwc/top-app-bar";
import { Icon } from "@rmwc/icon";
import useAuthenticated from "./use-authenticated";
import logo from "./logo.svg";
import "./Header.css";

type TData = {
  me: {
    account: {
      firstName: string;
    };
  };
};

function Header() {
  const authenticated = useAuthenticated();
  const { data } = useQuery<TData>(GET_USER, {
    skip: !authenticated,
  });
  return (
    <TopAppBar className="header">
      <TopAppBarRow>
        <TopAppBarSection alignStart>
          <TopAppBarTitle>
            <Link to="/">
              <Icon icon={logo} className="logo" />
            </Link>
          </TopAppBarTitle>
        </TopAppBarSection>
        <TopAppBarSection alignEnd>
          <TopAppBarActionItem icon="search" />
          <TopAppBarActionItem icon="notifications" />
          {data && (
            <>
              {/* <img height={30} src={data.user.picture} /> */}
              <Link to="/me">
                <span>{data.me.account.firstName}</span>
              </Link>
            </>
          )}
        </TopAppBarSection>
      </TopAppBarRow>
    </TopAppBar>
  );
}

export default Header;

const GET_USER = gql`
  query getUser {
    me {
      account {
        firstName
      }
    }
  }
`;
