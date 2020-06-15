import React, { useCallback, useEffect, useMemo } from "react";
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
import EntityFieldForm from "./EntityFieldForm";
import * as types from "./types";
import { GET_ENTITIES } from "./Entities";

type TData = {
  entity: types.Entity;
  entityField: types.EntityField;
};

const EntityField = () => {
  const match = useRouteMatch<{
    application: string;
    entity: string;
    field: string;
  }>("/:application/entities/:entity/fields/:field");

  const { application, entity, field } = match?.params ?? {};

  const { data, error, loading } = useQuery<TData>(GET_ENTITY_FIELD, {
    variables: {
      entity,
      field,
    },
  });

  const [updateEntityField, { error: updateError }] = useMutation(
    UPDATE_ENTITY_FIELD,
    {
      update(cache, { data: { updateEntityField } }) {
        const queryData = cache.readQuery<{
          app: {
            id: string;
            entities: Array<{
              id: string;
              name: string;
              fields: Array<{
                id: string;
                name: string;
                dataType: string;
              }>;
            }>;
          };
        }>({ query: GET_ENTITIES, variables: { id: application } });
        if (queryData === null) {
          return;
        }
        cache.writeQuery({
          query: GET_ENTITIES,
          variables: { id: application },
          data: {
            app: {
              ...queryData.app,
              entities: queryData.app.entities.map((appEntity) => {
                if (appEntity.id !== entity) {
                  return appEntity;
                }
                return {
                  ...appEntity,
                  fields: appEntity.fields.map((field) => {
                    if (field.id === updateEntityField.id) {
                      return updateEntityField;
                    }
                    return field;
                  }),
                };
              }),
            },
          },
        });
      },
    }
  );
  const [
    deleteEntityField,
    { error: deleteError, data: deleteData, loading: deleteLoading },
  ] = useMutation(DELETE_ENTITY_FIELD, {
    update(cache, { data: { deleteEntityField } }) {
      const queryData = cache.readQuery<{
        app: {
          id: string;
          entities: Array<{
            id: string;
            name: string;
            fields: Array<{
              id: string;
              name: string;
              dataType: string;
            }>;
          }>;
        };
      }>({ query: GET_ENTITIES, variables: { id: application } });
      if (queryData === null) {
        return;
      }
      cache.writeQuery({
        query: GET_ENTITIES,
        variables: { id: application },
        data: {
          app: {
            ...queryData.app,
            entities: queryData.app.entities.map((appEntity) => {
              if (appEntity.id !== entity) {
                return appEntity;
              }
              return {
                ...appEntity,
                fields: appEntity.fields.filter(
                  (field) => field.id !== deleteEntityField.id
                ),
              };
            }),
          },
        },
      });
    },
  });

  const history = useHistory();

  const handleSubmit = useCallback(
    (data) => {
      updateEntityField({
        variables: {
          where: {
            id: field,
          },
          data,
        },
      }).catch(console.error);
    },
    [updateEntityField, field]
  );

  const handleDelete = useCallback(() => {
    deleteEntityField({
      variables: {
        where: {
          id: field,
        },
      },
    }).catch(console.error);
  }, [deleteEntityField, field]);

  useEffect(() => {
    if (deleteData) {
      history.push(`/${application}/entities/`);
    }
  }, [history, deleteData, application]);

  const hasError =
    Boolean(error) || Boolean(updateError) || Boolean(deleteError);
  const errorMessage =
    formatError(error) || formatError(updateError) || formatError(deleteError);

  const defaultValues = useMemo(
    () =>
      data?.entityField && {
        ...data.entityField,
        properties: data.entityField.properties,
      },
    [data]
  );

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
          defaultValues={defaultValues}
        />
        <Button type="button" onClick={handleDelete} disabled={deleteLoading}>
          Remove
        </Button>
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
    updateEntityField(data: $data, where: $where) {
      id
      name
      dataType
    }
  }
`;

const DELETE_ENTITY_FIELD = gql`
  mutation deleteEntityField($where: WhereUniqueInput!) {
    deleteEntityField(where: $where) {
      id
    }
  }
`;
