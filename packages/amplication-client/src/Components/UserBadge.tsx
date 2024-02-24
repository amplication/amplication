import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";

import * as models from "../models";

import useAuthenticated from "../authentication/use-authenticated";
import { UserAvatar, Tooltip } from "@amplication/ui/design-system";

import "./UserBadge.scss";
import { identity } from "../util/analytics";
import { GET_USER } from "../Profile/accountQueries";

type TData = {
  me: {
    account: models.Account;
  };
};
const TOOLTIP_DIRECTION = "sw";

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
