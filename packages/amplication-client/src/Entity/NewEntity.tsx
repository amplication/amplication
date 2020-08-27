import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import { Snackbar } from "@rmwc/snackbar";

import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { formatError } from "../util/error";
import { GET_ENTITIES } from "./EntityList";
import * as models from "../models";
import { TextField } from "../Components/TextField";

type CreateEntityType = Omit<models.EntityCreateInput, "app">;
const INITIAL_VALUES: CreateEntityType = {
  name: "",
  displayName: "",
  pluralDisplayName: "",
  isPersistent: true,
  allowFeedback: false,
  description: "",
  primaryField: "",
};

type Props = {
  applicationId: string;
};

const NewEntity = ({ applicationId }: Props) => {
  const [createEntity, { error, data, loading }] = useMutation(CREATE_ENTITY, {
    update(cache, { data: { createOneEntity } }) {
      const queryData = cache.readQuery<{
        entities: models.Entity[];
      }>({ query: GET_ENTITIES, variables: { id: applicationId } });
      if (queryData === null) {
        return;
      }
      cache.writeQuery({
        query: GET_ENTITIES,
        variables: { id: applicationId },
        data: {
          entities: queryData.entities.concat([createOneEntity]),
        },
      });
    },
  });
  const history = useHistory();

  const handleSubmit = useCallback(
    (data: CreateEntityType) => {
      data.name = data.displayName;
      data.pluralDisplayName = data.displayName;
      createEntity({
        variables: {
          data: {
            ...data,
            app: { connect: { id: applicationId } },
            isPersistent: true,
          },
        },
      }).catch(console.error);
    },
    [createEntity, applicationId]
  );

  useEffect(() => {
    if (data) {
      history.push(`/${applicationId}/entities/${data.createOneEntity.id}`);
    }
  }, [history, data, applicationId]);

  const errorMessage = formatError(error);

  return (
    <>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        <Form>
          <TextField
            required
            name="displayName"
            label="New Field Name"
            disabled={loading}
            autoFocus
            trailingButton={{ icon: "add", title: "Create Entity" }}
            hideLabel
            placeholder="Type New Entity Name"
          />
        </Form>
      </Formik>
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
