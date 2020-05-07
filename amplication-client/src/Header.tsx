import React from "react";
import { Link } from "react-router-dom";
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
  TopAppBarActionItem,
} from "@rmwc/top-app-bar";
import { User } from "./types";

type Props = {
  organization: {
    name: string;
  };
  user: User | null;
};

function Header({ organization, user }: Props) {
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
          {user && (
            <>
              <img height={30} src={user.image} />
              <span>{user.name}</span>
            </>
          )}
        </TopAppBarSection>
      </TopAppBarRow>
    </TopAppBar>
  );
}

export default Header;
