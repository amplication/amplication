import React, { useCallback, useContext, useState } from "react";
import { gql, useMutation, Reference } from "@apollo/client";
import * as models from "../models";
import {
  ConfirmationDialog,
  UserAndTime,
  Panel,
  EnumPanelStyle,
} from "@amplication/ui/design-system";
import { Link, useHistory } from "react-router-dom";
import LockStatusIcon from "../VersionControl/LockStatusIcon";
import { Button, EnumButtonStyle } from "../Components/Button";
import { USER_ENTITY } from "./constants";
import "./EntityListItem.scss";
import { AppContext } from "../context/appContext";
import ConfirmationDialogFieldList from "./ConfirmationDialogFieldList";

const CONFIRM_BUTTON = { icon: "trash_2", label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type DType = {
  deleteEntity: { id: string };
};

type Props = {
  resourceId: string;
  entity: models.Entity;
  onDelete?: () => void;
  onError: (error: Error) => void;
  relatedEntities: models.Entity[];
  isUserEntityMandatory: boolean;
};

const CLASS_NAME = "entity-list-item";

export const EntityListItem = ({
  entity,
  resourceId,
  onDelete,
  onError,
  relatedEntities,
  isUserEntityMandatory,
}: Props) => {
  const { addEntity, currentWorkspace, currentProject } =
    useContext(AppContext);
  const history = useHistory();

  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const [deleteEntity, { loading: deleteLoading }] = useMutation<DType>(
    DELETE_ENTITY,
    {
      update(cache, { data }) {
        if (!data) return;
        const deletedEntityId = data.deleteEntity.id;

        cache.modify({
          fields: {
            entities(existingEntityRefs, { readField }) {
              return existingEntityRefs.filter(
                (entityRef: Reference) =>
                  deletedEntityId !== readField("id", entityRef)
              );
            },
          },
        });
      },
      onCompleted: (data) => {
        addEntity(data.deleteEntity.id);
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
    deleteEntity({
      variables: {
        entityId: entity.id,
      },
    }).catch(onError);
  }, [entity, deleteEntity, onError]);

  const handleRowClick = useCallback(() => {
    history.push(
      `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/entities/${entity.id}`
    );
  }, [history, resourceId, entity, currentWorkspace, currentProject]);

  const [latestVersion] = entity.versions || [];

  const isUserEntity = entity.name === USER_ENTITY;

  const isDeleteButtonDisable = isUserEntity && isUserEntityMandatory;

  const deleteMessage = isUserEntity
    ? "Deleting this entity may impact the authentication functionality of your service"
    : "you want to delete this entity?";

  const deleteMessageConfirmation = isUserEntity ? "Notice:" : "Are you sure";

  const deleteClassName = isUserEntity ? "__alert-bold-notice" : "__alert-bold";

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmDelete}
        title={`Delete '${entity.displayName}' ?`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={
          <span>
            <span className={`${CLASS_NAME}${deleteClassName}`}>
              {deleteMessageConfirmation}
            </span>{" "}
            {deleteMessage}
            <br />
            {relatedEntities.length > 0 && (
              <ConfirmationDialogFieldList relatedEntities={relatedEntities} />
            )}
          </span>
        }
        onConfirm={handleConfirmDelete}
        onDismiss={handleDismissDelete}
      />
      <Panel
        className={CLASS_NAME}
        clickable
        onClick={handleRowClick}
        panelStyle={EnumPanelStyle.Bordered}
      >
        <div className={`${CLASS_NAME}__row`}>
          <Link
            className={`${CLASS_NAME}__title`}
            title={entity.displayName}
            to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/entities/${entity.id}`}
          >
            {entity.displayName}
          </Link>
          {Boolean(entity.lockedByUser) && (
            <LockStatusIcon lockedByUser={entity.lockedByUser} />
          )}

          <span className="spacer" />
          {!deleteLoading && (
            <Button
              buttonStyle={EnumButtonStyle.Text}
              icon="trash_2"
              onClick={handleDelete}
              disabled={isDeleteButtonDisable}
            />
          )}
        </div>
        <div className={`${CLASS_NAME}__row`}>
          <span className={`${CLASS_NAME}__description`}>
            {entity.description}
          </span>
        </div>
        <div className={`${CLASS_NAME}__divider`} />

        <div className={`${CLASS_NAME}__row`}>
          <span className={`${CLASS_NAME}__label`}>Last commit:</span>

          {latestVersion.commit && (
            <UserAndTime
              account={latestVersion.commit.user?.account}
              time={latestVersion.commit.createdAt}
            />
          )}
          <span className={`${CLASS_NAME}__description`}>
            {latestVersion.commit ? latestVersion.commit?.message : "Never"}
          </span>
          <span className="spacer" />
          {entity.lockedByUser && (
            <>
              <span className={`${CLASS_NAME}__label`}>Locked by:</span>
              <UserAndTime
                account={entity.lockedByUser.account || {}}
                time={entity.lockedAt}
              />
            </>
          )}
        </div>
      </Panel>
    </>
  );
};

const DELETE_ENTITY = gql`
  mutation deleteEntity($entityId: String!) {
    deleteEntity(where: { id: $entityId }) {
      id
    }
  }
`;
