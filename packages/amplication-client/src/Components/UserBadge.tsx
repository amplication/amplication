import React, { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { Tooltip } from "@primer/components";

import * as models from "../models";

import useAuthenticated from "../authentication/use-authenticated";
import { UserAvatar } from "@amplication/design-system";

import "./UserBadge.scss";
import { identity } from "../util/analytics";

type TData = {
  me: {
    account: models.Account;
  };
};
const TOOLTIP_DIRECTION = "e";

function UserBadge() {
  const authenticated = useAuthenticated();
  const { data } = useQuery<TData>(GET_USER, {
    skip: !authenticated,
  });

  useEffect(() => {
    if (data) {
      identity(data.me.account.id, {
        createdAt: data.me.account.createdAt,
        email: data.me.account.email,
      });
    }
  }, [data]);

  return data ? (
    <Tooltip
      direction={TOOLTIP_DIRECTION}
      noDelay
      wrap
      aria-label={`${data.me.account.firstName} ${data.me.account.lastName}`}
    >
      <UserAvatar
        firstName={data.me.account.firstName}
        lastName={data.me.account.lastName}
      />
    </Tooltip>
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
        createdAt
      }
    }
  }
`;
