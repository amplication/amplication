import { useEffect } from "react";
import { Tooltip, UserAvatar } from "@amplication/ui/design-system";
import useCurrentUser from "../User/hooks/useCurrentUser";
import { identity } from "../util/analytics";
import "./UserBadge.scss";

const TOOLTIP_DIRECTION = "sw";

function UserBadge() {
  const { currentUserData: data } = useCurrentUser();

  useEffect(() => {
    if (data) {
      identity(data.account.id, {
        createdAt: data.account.createdAt,
        email: data.account.email,
      });
    }
  }, [data]);

  return data ? (
    <Tooltip
      direction={TOOLTIP_DIRECTION}
      noDelay
      wrap
      aria-label={`${data.account.firstName} ${data.account.lastName}`}
    >
      <UserAvatar
        firstName={data.account.firstName}
        lastName={data.account.lastName}
      />
    </Tooltip>
  ) : null;
}

export default UserBadge;
