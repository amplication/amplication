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
import { isAuthenticated } from "./authentication";

type Props = {
  organization: {
    name: string;
  };
};

function Header({ organization }: Props) {
  const { data } = useQuery<{
    user: { name: string; picture: string };
  }>(GET_USER, {
    skip: !isAuthenticated(),
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
              <img height={30} src={data.user.picture} />
              <span>{data.user.name}</span>
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
    user {
      name
      picture
    }
  }
`;
