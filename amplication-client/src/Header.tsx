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
import useAuthenticated from "./use-authenticated";

type Props = {
  organization: {
    name: string;
  };
};

function Header({ organization }: Props) {
  const authenticated = useAuthenticated();
  const { data } = useQuery<{
    me: { account: { firstName: string } };
  }>(GET_USER, {
    skip: !authenticated,
  });
  return (
    <TopAppBar>
      <TopAppBarRow>
        <TopAppBarSection alignStart>
          <TopAppBarTitle>
            <Link to="/">{organization.name}</Link>
          </TopAppBarTitle>
        </TopAppBarSection>
        <TopAppBarSection alignEnd>
          <TopAppBarActionItem icon="search" />
          <TopAppBarActionItem icon="notifications" />
          {data && (
            <>
              {/* <img height={30} src={data.user.picture} /> */}
              <Link to="/account">
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
