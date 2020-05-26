import React, { useCallback, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { DrawerHeader, DrawerTitle, DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { formatError } from "../errorUtil";
import getFormData from "../get-form-data";
import EntityFieldForm from "./EntityFieldForm";
import * as types from "./types";

type Props = {
  onUpdate: () => void;
  onDelete: () => void;
};

type TData = {
  entity: types.Entity;
  entityField: types.EntityField;
};

const EntityField = ({ onUpdate, onDelete }: Props) => {
  const match = useRouteMatch<{
    application: string;
    entity: string;
    field: string;
  }>("/:application/entities/:entity/fields/:field");

  const { application, entity, field } = match?.params ?? {};

  const { data, loading } = useQuery<TData>(GET_ENTITY_FIELD, {
    variables: {
      entity,
      field,
    },
  });

  const [
    updateEntityField,
    { error: updateError, data: updateData, loading: updateLoading },
  ] = useMutation(UPDATE_ENTITY_FIELD);
  const [
    deleteEntityField,
    { error: deleteError, data: deleteData, loading: deleteLoading },
  ] = useMutation(DELETE_ENTITY_FIELD);

  const history = useHistory();

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const data = getFormData(event.target);
      updateEntityField({
        variables: {
          where: {
            id: field,
          },
          data: {
            ...data,
          },
        },
      })
        .then(onUpdate)
        .catch(console.error);
    },
    [updateEntityField, onUpdate, field]
  );

  const handleDelete = useCallback(() => {
    deleteEntityField({
      variables: {
        where: {
          id: field,
        },
      },
    })
      .then(onDelete)
      .catch(console.error);
  }, [deleteEntityField, onDelete, field]);

  const handleCancel = useCallback(() => {
    history.push(`/${application}/entities/`);
  }, [history, application]);

  useEffect(() => {
    if (deleteData) {
      history.push(`/${application}/entities/`);
    }
  }, [history, deleteData, application]);

  const hasError = Boolean(updateError) || Boolean(deleteError);
  const errorMessage = formatError(updateError) || formatError(deleteError);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>
          {data?.entity.name} | {data?.entityField.name}
        </DrawerTitle>
      </DrawerHeader>

      <DrawerContent>
        <EntityFieldForm
          submitButtonTitle="Update"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          defaultValues={data?.entityField}
          actions={[
            <Button
              type="button"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              Remove
            </Button>,
          ]}
        />
      </DrawerContent>
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default EntityField;

const GET_ENTITY_FIELD = gql`
  query getEntityField($entity: String!, $field: String!) {
    entity(where: { id: $entity }) {
      name
    }
    entityField(where: { id: $field }) {
      id
      createdAt
      updatedAt
      name
      displayName
      dataType
      properties
      required
      searchable
      description
    }
  }
`;

const UPDATE_ENTITY_FIELD = gql`
  mutation updateEntityField(
    $data: EntityFieldUpdateInput!
    $where: WhereUniqueInput!
  ) {
    updateOneEntityField(data: $data, where: $where) {
      id
    }
  }
`;

const DELETE_ENTITY_FIELD = gql`
  mutation deleteEntityField($where: WhereUniqueInput!) {
    deleteOneEntity(where: $where) {
      id
    }
  }
`;
