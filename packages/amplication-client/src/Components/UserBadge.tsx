import React, { useEffect } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import * as models from "../models";

import useAuthenticated from "../authentication/use-authenticated";
import UserAvatar from "../Components/UserAvatar";

import "./UserBadge.scss";
import { setUserId, identifySetOnce } from "../util/analytics";

type TData = {
  me: {
    account: models.Account;
  };
};

function UserBadge() {
  const authenticated = useAuthenticated();
  const { data } = useQuery<TData>(GET_USER, {
    skip: !authenticated,
  });

  useEffect(() => {
    if (data) {
      setUserId(data.me.account.id);
      identifySetOnce({ key: "signupDate", value: new Date() });
    }
  }, [data]);

  return data ? (
    <UserAvatar
      firstName={data.me.account.firstName}
      lastName={data.me.account.firstName}
    />
  ) : null;
}

export default UserBadge;

const GET_USER = gql`
  query getUser {
    me {
      account {
        id
        email
        firstName
        lastName
      }
    }
  }
`;
