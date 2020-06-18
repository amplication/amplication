import React, { useCallback, useEffect } from "react";
import { useHistory, match } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { DrawerHeader, DrawerTitle, DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { formatError } from "../util/error";
import { GET_ENTITIES } from "./Entities";
import EntityForm from "./EntityForm";

type Props = {
  match: match<{ application: string }>;
};

const NewEntity = ({ match }: Props) => {
  const { application } = match?.params ?? {};

  const [createEntity, { error, data }] = useMutation(CREATE_ENTITY, {
    update(cache, { data: { createOneEntity } }) {
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
            entities: queryData.app.entities.concat([createOneEntity]),
          },
        },
      });
    },
  });
  const history = useHistory();

  const handleSubmit = useCallback(
    (data) => {
      createEntity({
        variables: {
          data: {
            ...data,
            app: { connect: { id: application } },
            isPersistent: true,
          },
        },
      }).catch(console.error);
    },
    [createEntity, application]
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
        <DrawerTitle>New Entity</DrawerTitle>
      </DrawerHeader>
      <DrawerContent>
        <EntityForm onSubmit={handleSubmit} submitButtonTitle="Create" />
      </DrawerContent>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
};

export default NewEntity;

const CREATE_ENTITY = gql`
  mutation createEntity($data: EntityCreateInput!) {
    createOneEntity(data: $data) {
      id
      name
      fields {
        id
        name
        dataType
      }
    }
  }
`;
