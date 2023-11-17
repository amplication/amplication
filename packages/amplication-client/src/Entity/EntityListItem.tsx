import {
  ConfirmationDialog,
  EnumContentAlign,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  ListItem,
  Text,
  UserAndTime,
} from "@amplication/ui/design-system";
import { Reference, gql, useMutation } from "@apollo/client";
import { useCallback, useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import useResource from "../Resource/hooks/useResource";
import { UPDATE_SERVICE_SETTINGS } from "../Resource/resourceSettings/GenerationSettingsForm";
import useSettingsHook from "../Resource/useSettingsHook";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import ConfirmationDialogFieldList from "./ConfirmationDialogFieldList";
import "./EntityListItem.scss";
import { USER_ENTITY } from "./constants";

const CONFIRM_BUTTON = { icon: "trash_2", label: "Delete" };
const DISMISS_BUTTON = { label: "Dismiss" };

type DType = {
  deleteEntity: { id: string };
};

type TData = {
  updateServiceSettings: models.ServiceSettings;
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

  const { resourceSettings } = useResource(resourceId);

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

  const { trackEvent } = useTracking();

  const [updateResourceSettings] = useMutation<TData>(UPDATE_SERVICE_SETTINGS);
  const { handleSubmit } = useSettingsHook({
    trackEvent,
    resourceId,
    updateResourceSettings,
  });

  const handleConfirmDelete = useCallback(() => {
    setConfirmDelete(false);

    const authEntity = resourceSettings?.serviceSettings?.authEntityName;

    deleteEntity({
      variables: {
        entityId: entity.id,
      },
    }).catch(onError);

    if (authEntity === entity.name) {
      const updateServiceSettings = {
        ...resourceSettings?.serviceSettings,
        authEntityName: null,
      };
      handleSubmit(updateServiceSettings);
    }
  }, [entity, deleteEntity, onError]);

  const handleRowClick = useCallback(() => {
    history.push(
      `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/entities/${entity.id}`
    );
  }, [history, resourceId, entity, currentWorkspace, currentProject]);

  const [latestVersion] = entity.versions || [];

  const isAuthEntity = resourceSettings?.serviceSettings?.authEntityName
    ? entity.name === resourceSettings?.serviceSettings?.authEntityName
    : entity.name === USER_ENTITY;

  const isDeleteButtonDisable = isAuthEntity && isUserEntityMandatory;

  const deleteMessage = isAuthEntity
    ? "Deleting this entity may impact the authentication functionality of your service"
    : "you want to delete this entity?";

  const deleteMessageConfirmation = isAuthEntity ? "Notice:" : "Are you sure";

  const deleteClassName = isAuthEntity ? "__alert-bold-notice" : "__alert-bold";

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
      <ListItem onClick={handleRowClick}>
        <FlexItem
          margin={EnumFlexItemMargin.Bottom}
          start={
            <FlexItem
              direction={EnumFlexDirection.Column}
              gap={EnumGapSize.Small}
            >
              <Link
                title={entity.displayName}
                to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/entities/${entity.id}`}
              >
                <Text>{entity.displayName}</Text>
              </Link>
              <Text textStyle={EnumTextStyle.Subtle}>{entity.description}</Text>
            </FlexItem>
          }
          end={
            !deleteLoading && (
              <Button
                buttonStyle={EnumButtonStyle.Text}
                icon="trash_2"
                onClick={handleDelete}
                disabled={isDeleteButtonDisable}
              />
            )
          }
        ></FlexItem>

        <FlexItem
          contentAlign={EnumContentAlign.Center}
          itemsAlign={EnumItemsAlign.Center}
          start={
            <UserAndTime
              account={latestVersion.commit?.user?.account}
              time={latestVersion.commit?.createdAt}
              label="Last commit:"
            />
          }
          end={
            <FlexItem
              itemsAlign={EnumItemsAlign.Center}
              contentAlign={EnumContentAlign.End}
              direction={EnumFlexDirection.Row}
            >
              {entity.lockedByUser && (
                <UserAndTime
                  account={entity.lockedByUser.account || {}}
                  time={entity.lockedAt}
                  label="Locked:"
                  valueColor={EnumTextColor.ThemeRed}
                />
              )}
            </FlexItem>
          }
        ></FlexItem>
      </ListItem>
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
