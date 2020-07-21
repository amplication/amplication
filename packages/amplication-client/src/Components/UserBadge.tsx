import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { SideNav } from "@primer/components";

import useAuthenticated from "../authentication/use-authenticated";
import MenuItem from "../Layout/MenuItem";

import "./UserBadge.scss";

type TData = {
  me: {
    account: {
      firstName: string;
    };
  };
};

function UserBadge() {
  const authenticated = useAuthenticated();
  const { data } = useQuery<TData>(GET_USER, {
    skip: !authenticated,
  });
  return (
    <>
      {data && (
        <SideNav className="side-nav user-badge">
          <MenuItem
            title="User Settings"
            to="/me"
            icon="search"
            className="app-icon"
          >
            <span>{data.me.account.firstName}</span>
          </MenuItem>
        </SideNav>
      )}
    </>
  );
}

export default UserBadge;

const GET_USER = gql`
  query getUser {
    me {
      account {
        firstName
      }
    }
  }
`;
