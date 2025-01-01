import { useCallback, useState } from "react";
import { useTracking } from "../util/analytics";

import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";

import {
  Chip,
  ConfirmationDialog,
  EnumChipStyle,
  EnumFlexDirection,
  EnumTextStyle,
  FlexItem,
  ListItem,
  Text,
  Tooltip,
  UserAvatar,
} from "@amplication/ui/design-system";
import { gql, useMutation } from "@apollo/client";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { UserInfo } from "../Components/UserInfo";
import { useAppContext } from "../context/appContext";

type DType = {
  deleteUser: models.User;
};

type Props = {
  member: models.WorkspaceMember;
  onDelete?: () => void;
  onError: (error: Error) => void;
};

const DIRECTION = "n";
const CONFIRM_BUTTON = { icon: "trash_2", label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

function MemberListItem({ member, onDelete, onError }: Props) {
  const { trackEvent } = useTracking();
  const { currentWorkspace } = useAppContext();

  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const [deleteUser, { loading: deleteLoading }] = useMutation<DType>(
    DELETE_USER,
    {
      onCompleted: (data) => {
        onDelete && onDelete();
      },
    }
  );

  const [revokeInvitation, { loading: revokeLoading }] = useMutation(
    REVOKE_INVITATION,
    {
      onCompleted: (data) => {
        onDelete && onDelete();
      },
    }
  );

  const [resendInvitation] = useMutation(RESEND_INVITATION);

  const handleDelete = useCallback(
    (event) => {
      event.stopPropagation();
      setConfirmDelete(true);
    },
    [setConfirmDelete]
  );

  const handleDismissDelete = useCallback(() => {
    setConfirmDelete(false);
  }, [setConfirmDelete]);

  const handleConfirmDelete = useCallback(() => {
    setConfirmDelete(false);

    if (member.type === models.EnumWorkspaceMemberType.User) {
      trackEvent({
        eventName: AnalyticsEventNames.WorkspaceMemberFromWorkspaceDelete,
      });
      deleteUser({
        variables: {
          userId: member.member.id,
        },
      }).catch(onError);
    } else {
      trackEvent({
        eventName: AnalyticsEventNames.WorkspaceMemberInvitationRevoke,
      });
      revokeInvitation({
        variables: {
          id: member.member.id,
        },
      }).catch(onError);
    }
  }, [member, deleteUser, onError, trackEvent, revokeInvitation]);

  const handleResendInvitation = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.WorkspaceMemberInvitationResend,
    });
    resendInvitation({
      variables: {
        id: member.member.id,
      },
    }).catch(onError);
  }, [member, resendInvitation, trackEvent, onError]);

  const data =
    member.type === models.EnumWorkspaceMemberType.User
      ? {
          firstName: (member.member as models.User).account?.firstName,
          lastName: (member.member as models.User).account?.lastName,
          email: (member.member as models.User).account?.email,
          isOwner: (member.member as models.User).isOwner,
          isInvitation: false,
        }
      : {
          firstName: (member.member as models.Invitation).email,
          lastName: undefined,
          email: (member.member as models.Invitation).email,
          isOwner: false,
          isInvitation: true,
        };

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete user`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message="Are you sure you want to delete this user?"
        onConfirm={handleConfirmDelete}
        onDismiss={handleDismissDelete}
      />
      <ListItem
        direction={EnumFlexDirection.Row}
        to={
          member.type === models.EnumWorkspaceMemberType.User
            ? `/${currentWorkspace?.id}/settings/members/${member.member.id}`
            : undefined
        }
        end={
          <FlexItem direction={EnumFlexDirection.Row}>
            {data.isInvitation && (
              <Tooltip
                aria-label="Resend invitation"
                direction={DIRECTION}
                noDelay
              >
                <Button
                  buttonStyle={EnumButtonStyle.Text}
                  icon="mail"
                  onClick={handleResendInvitation}
                />
              </Tooltip>
            )}
            {!data.isOwner && !deleteLoading && !revokeLoading && (
              <Tooltip
                aria-label={
                  data.isInvitation ? "Revoke invitation" : "Delete user"
                }
                direction={DIRECTION}
                noDelay
              >
                <Button
                  buttonStyle={EnumButtonStyle.Text}
                  icon="trash_2"
                  onClick={handleDelete}
                />
              </Tooltip>
            )}
          </FlexItem>
        }
      >
        {member.type === models.EnumWorkspaceMemberType.User ? (
          <UserInfo user={member.member as models.User} />
        ) : (
          <Text textStyle={EnumTextStyle.Normal}>{data.email}</Text>
        )}

        {data.isOwner && <Chip chipStyle={EnumChipStyle.ThemeBlue}>Owner</Chip>}
        {data.isInvitation && (
          <Chip chipStyle={EnumChipStyle.ThemePurple}>Pending</Chip>
        )}
      </ListItem>
    </>
  );
}

export default MemberListItem;

const DELETE_USER = gql`
  mutation deleteUser($userId: String!) {
    deleteUser(where: { id: $userId }) {
      id
    }
  }
`;

const REVOKE_INVITATION = gql`
  mutation revokeInvitation($id: String!) {
    revokeInvitation(where: { id: $id }) {
      id
    }
  }
`;

const RESEND_INVITATION = gql`
  mutation resendInvitation($id: String!) {
    resendInvitation(where: { id: $id }) {
      id
    }
  }
`;
