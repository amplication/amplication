import React, { useCallback } from "react";
import { Button } from "@rmwc/button";
import "@material/button/dist/mdc.button.css";
import "@material/ripple/dist/mdc.ripple.css";
import { unsetToken } from "./authentication";
import useAuthenticated from "./use-authenticated";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

type TData = {
  me: {
    account: {
      email: string;
      firstName: string;
      lastName: string;
    };
    organization: {
      name: string;
    };
  };
};

function User() {
  const { data } = useQuery<TData>(GET_USER);
  const authenticated = useAuthenticated();
  const signOut = useCallback(() => {
    unsetToken();
  }, []);
  return (
    <>
      <h1>
        {data?.me.account.firstName} {data?.me.account.lastName}
      </h1>
      <p>Email: {data?.me.account.email}</p>
      <p>Organization: {data?.me.organization.name}</p>
      <Button raised onClick={signOut} disabled={!authenticated}>
        Signout
      </Button>
    </>
  );
}

export default User;

const GET_USER = gql`
  query getAccount {
    me {
      account {
        email
        firstName
        lastName
      }
      organization {
        name
      }
    }
  }
`;
