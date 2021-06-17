import React, { useCallback } from "react";
import { useTracking } from "../util/analytics";

import * as models from "../models";

import "./MemberListItem.scss";
import { EnumPanelStyle, Panel, UserAvatar } from "@amplication/design-system";

type Props = {
  member: models.WorkspaceMember;
};

const CLASS_NAME = "member-list-item";

function MemberListItem({ member }: Props) {
  const { trackEvent } = useTracking();

  const handleClick = useCallback(() => {
    trackEvent({
      eventName: "memberListItemClick",
    });
  }, [trackEvent]);

  const data =
    member.type === models.EnumWorkspaceMemberType.User
      ? {
          firstName: (member.member as models.User).account?.firstName,
          lastName: (member.member as models.User).account?.lastName,
          email: (member.member as models.User).account?.email,
          isOwner: (member.member as models.User).isOwner,
        }
      : {
          firstName: (member.member as models.Invitation).email,
          lastName: undefined,
          email: (member.member as models.Invitation).email,
          isOwner: false,
        };

  return (
    <Panel
      className={CLASS_NAME}
      onClick={handleClick}
      panelStyle={EnumPanelStyle.Bordered}
    >
      <div className={`${CLASS_NAME}__row`}>
        <UserAvatar firstName={data.firstName} lastName={data.lastName} />

        <span className={`${CLASS_NAME}__title`}>{data.email}</span>
        {data.isOwner && (
          <span className={`${CLASS_NAME}__description`}>(Owner)</span>
        )}
        <span className="spacer" />
      </div>
    </Panel>
  );
}

export default MemberListItem;
