import React, { useCallback, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import { Snackbar } from "@rmwc/snackbar";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { pascalCase } from "pascal-case";
import { formatError } from "../util/error";
import { GET_ENTITIES } from "./EntityList";
import * as models from "../models";
import { TextField } from "../Components/TextField";
import { Button, EnumButtonStyle } from "../Components/Button";
import { generatePluralDisplayName } from "../Components/PluralDisplayNameField";
import PendingChangesContext from "../VersionControl/PendingChangesContext";
import { useTracking } from "../util/analytics";

type CreateEntityType = Omit<models.EntityCreateInput, "app">;

type EntityListType = {
  entities: models.Entity[];
};

type DType = {
  createOneEntity: models.Entity;
};

type Props = {
  applicationId: string;
};

const INITIAL_VALUES: CreateEntityType = {
  name: "",
  displayName: "",
  pluralDisplayName: "",
  description: "",
};

const NewEntity = ({ applicationId }: Props) => {
  const { trackEvent } = useTracking();
  const pendingChangesContext = useContext(PendingChangesContext);

  const [createEntity, { error, data, loading }] = useMutation<DType>(
    CREATE_ENTITY,
    {
      onCompleted: (data) => {
        pendingChangesContext.addEntity(data.createOneEntity.id);
        trackEvent({
          eventName: "createEntity",
          entityName: data.createOneEntity.displayName,
        });
      },
      update(cache, { data }) {
        if (!data) return;

        const queryData = cache.readQuery<EntityListType>({
          query: GET_ENTITIES,
          variables: { id: applicationId },
        });
        if (queryData === null) {
          return;
        }
        cache.writeQuery({
          query: GET_ENTITIES,
          variables: { id: applicationId },
          data: {
            entities: queryData.entities.concat([data.createOneEntity]),
          },
        });
      },
    }
  );
  const history = useHistory();

  const handleSubmit = useCallback(
    (data: CreateEntityType) => {
      const displayName = data.displayName.trim();
      createEntity({
        variables: {
          data: {
            ...data,
            displayName: displayName,
            name: pascalCase(displayName),
            pluralDisplayName: generatePluralDisplayName(displayName),
            app: { connect: { id: applicationId } },
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
          <div className="instructions">
            Give your new entity a descriptive name. <br />
            For example: Customer, Support Ticket, Purchase Order...
          </div>
          <TextField
            required
            name="displayName"
            label="New Entity Name"
            disabled={loading}
            autoFocus
            hideLabel
            placeholder="Type New Entity Name"
            autoComplete="off"
          />
          <Button buttonStyle={EnumButtonStyle.Primary}>Create Entity</Button>
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
