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

type Props = {
  onCreate: () => void;
};

const NewEntityField = ({ onCreate }: Props) => {
  const match = useRouteMatch<{ application: string; entity: string }>(
    "/:application/entities/:entity/fields/new"
  );

  const { application, entity } = match?.params ?? {};

  const params = new URLSearchParams(window.location.search);
  const entityName = params.get("entity-name");

  const [createEntityField, { error, data }] = useMutation(CREATE_ENTITY_FIELD);
  const history = useHistory();

  const handleSubmit = useCallback(
    (data) => {
      createEntityField({
        variables: {
          data: {
            ...data,
            /** @todo */
            properties: JSON.stringify({}),
            entity: { connect: { id: entity } },
          },
        },
      })
        .then(onCreate)
        .catch(console.error);
    },
    [createEntityField, onCreate, entity]
  );

  const handleCancel = useCallback(() => {
    history.push(`/${application}/entities/`);
  }, [history, application]);

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
        <EntityFieldForm
          submitButtonTitle="Create"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DrawerContent>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
};

export default NewEntityField;

const CREATE_ENTITY_FIELD = gql`
  mutation createEntityField($data: EntityFieldCreateInput!) {
    createEntityField(data: $data) {
      id
    }
  }
`;
