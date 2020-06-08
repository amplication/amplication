import React, { useCallback, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { DrawerHeader, DrawerTitle, DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { formatError } from "../errorUtil";
import EntityFieldForm from "./EntityFieldForm";
import { GET_ENTITIES } from "./Entities";

const NewEntityField = () => {
  const { application, entity } = useCreateEntityFieldRouteParams();

  const params = new URLSearchParams(window.location.search);
  const entityName = params.get("entity-name");

  const [createEntityField, { data, error }] = useCreateEntityField(
    application,
    entity
  );
  const history = useHistory();

  const handleSubmit = useCallback(
    (data) => {
      createEntityField({
        variables: {
          data: {
            ...data,
            entity: { connect: { id: entity } },
          },
        },
      }).catch(console.error);
    },
    [createEntityField, entity]
  );

  useEffect(() => {
    if (data) {
      history.push(`/${application}/entities/`);
    }
  }, [history, data, application]);

  const errorMessage = formatError(error);

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>{entityName} | New Entity Field</DrawerTitle>
      </DrawerHeader>

      <DrawerContent>
        <EntityFieldForm submitButtonTitle="Create" onSubmit={handleSubmit} />
      </DrawerContent>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
};

export default NewEntityField;

type RouteParams = {
  application?: string;
  entity?: string;
};

export const useCreateEntityFieldRouteParams = (): RouteParams => {
  const match = useRouteMatch<RouteParams>(
    "/:application/entities/:entity/fields/new"
  );

  return match?.params ?? {};
};

export const useCreateEntityField = (application?: string, entity?: string) => {
  return useMutation(CREATE_ENTITY_FIELD, {
    update(cache, { data: { createEntityField } }) {
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
                fields: appEntity.fields.concat([createEntityField]),
              };
            }),
          },
        },
      });
    },
  });
};

const CREATE_ENTITY_FIELD = gql`
  mutation createEntityField($data: EntityFieldCreateInput!) {
    createEntityField(data: $data) {
      id
      name
      dataType
    }
  }
`;
