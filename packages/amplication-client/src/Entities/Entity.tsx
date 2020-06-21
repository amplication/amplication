import React, { useCallback, useEffect } from "react";
import { useHistory, match } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { DrawerHeader, DrawerTitle, DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import { Snackbar } from "@rmwc/snackbar";
import { formatError } from "../util/error";
import DeleteFooter from "./DeleteFooter";
import { GET_ENTITIES } from "./Entities";
import EntityForm from "./EntityForm";

type Props = {
  match: match<{ application: string; entity: string }>;
};

const Entity = ({ match }: Props) => {
  const { application, entity: entityId } = match?.params ?? {};

  const { data, error, loading } = useQuery(GET_ENTITY, {
    variables: {
      entity: entityId,
    },
  });

  const [updateEntity, { error: updateError }] = useMutation(UPDATE_ENTITY, {
    update(cache, { data: { updateEntity } }) {
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
            entities: queryData.app.entities.map((entity) => {
              if (entity.id === entityId) {
                return updateEntity;
              }
              return entity;
            }),
          },
        },
      });
    },
  });

  const [
    deleteEntity,
    { error: deleteError, data: deleteData, loading: deleteLoading },
  ] = useMutation(DELETE_ENTITY, {
    update(cache) {
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
            entities: queryData.app.entities.filter((entity) => {
              return entity.id !== entityId;
            }),
          },
        },
      });
    },
  });

  const history = useHistory();

  const handleSubmit = useCallback(
    (data) => {
      updateEntity({
        variables: {
          data: {
            ...data,
            app: { connect: { id: application } },
            isPersistent: true,
          },
        },
      }).catch(console.error);
    },
    [updateEntity, application]
  );

  const handleDelete = useCallback(() => {
    deleteEntity({
      variables: {
        id: entityId,
      },
    });
  }, [deleteEntity, entityId]);

  useEffect(() => {
    if (deleteData) {
      history.push(`/${application}/entities/`);
    }
  }, [history, deleteData, application]);

  const hasError =
    Boolean(error) || Boolean(updateError) || Boolean(deleteError);
  const errorMessage =
    formatError(error) || formatError(updateError) || formatError(deleteError);

  if (loading) {
    return <>Loading...</>;
  }

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>{data.entity.displayName}</DrawerTitle>
      </DrawerHeader>
      <DrawerContent>
        <EntityForm
          onSubmit={handleSubmit}
          submitButtonTitle="Update"
          defaultValues={data.entity}
        />
        <DeleteFooter onClick={handleDelete} disabled={deleteLoading} />
      </DrawerContent>
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default Entity;

const GET_ENTITY = gql`
  query getEntity($entity: String!) {
    entity(where: { id: $entity }) {
      name
      displayName
      pluralDisplayName
      allowFeedback
    }
  }
`;

const UPDATE_ENTITY = gql`
  mutation updateEntity($data: EntityUpdateInput!) {
    updateEntity(data: $data) {
      id
    }
  }
`;

const DELETE_ENTITY = gql`
  mutation deleteEntityField($where: WhereUniqueInput!) {
    deleteEntityField(where: $where) {
      id
    }
  }
`;
