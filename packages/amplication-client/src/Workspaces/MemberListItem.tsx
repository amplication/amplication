import React, { useCallback, useState } from "react";
import { useTracking } from "../util/analytics";

import * as models from "../models";
import { Button, EnumButtonStyle } from "../Components/Button";

import "./MemberListItem.scss";
import {
  ConfirmationDialog,
  EnumPanelStyle,
  Panel,
  UserAvatar,
} from "@amplication/design-system";
import { gql, useMutation } from "@apollo/client";

type DType = {
  deleteUser: models.User;
};

type Props = {
  member: models.WorkspaceMember;
  onDelete?: () => void;
  onError: (error: Error) => void;
};

const CLASS_NAME = "member-list-item";
const CONFIRM_BUTTON = { icon: "trash_2", label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

function MemberListItem({ member, onDelete, onError }: Props) {
  const { trackEvent } = useTracking();

  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const [deleteUser, { loading: deleteLoading }] = useMutation<DType>(
    DELETE_USER,
    {
      onCompleted: (data) => {
        onDelete && onDelete();
      },
    }
  );

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
    trackEvent({
      eventName: "deleteUserFromWorkspace",
    });
    deleteUser({
      variables: {
        userId: member.member.id,
      },
    }).catch(onError);
  }, [member, deleteUser, onError, trackEvent]);

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
      <Panel className={CLASS_NAME} panelStyle={EnumPanelStyle.Bordered}>
        <div className={`${CLASS_NAME}__row`}>
          <UserAvatar firstName={data.firstName} lastName={data.lastName} />

          <span className={`${CLASS_NAME}__title`}>{data.email}</span>
          {data.isOwner && (
            <span className={`${CLASS_NAME}__description`}>(Owner)</span>
          )}
          <span className="spacer" />
          {!data.isOwner && !deleteLoading && (
            <Button
              buttonStyle={EnumButtonStyle.Clear}
              icon="trash_2"
              onClick={handleDelete}
            />
          )}
        </div>
      </Panel>
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
