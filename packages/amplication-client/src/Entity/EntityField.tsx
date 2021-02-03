import React, { useCallback, useMemo, useContext, useState } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import "@rmwc/drawer/styles";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";

import { formatError } from "../util/error";
import EntityFieldForm from "./EntityFieldForm";
import * as models from "../models";
import PendingChangesContext from "../VersionControl/PendingChangesContext";

import { useTracking } from "../util/analytics";
import { SYSTEM_DATA_TYPES } from "./constants";
import { DeleteEntityField } from "./DeleteEntityField";
import "./EntityField.scss";

type TData = {
  entity: models.Entity;
};

type UpdateData = {
  updateEntityField: models.EntityField;
};

const CLASS_NAME = "entity-field";

const EntityField = () => {
  const { trackEvent } = useTracking();
  const pendingChangesContext = useContext(PendingChangesContext);
  const history = useHistory();
  const [error, setError] = useState<Error>();

  const match = useRouteMatch<{
    application: string;
    entity: string;
    field: string;
  }>("/:application/entities/:entity/fields/:field");

  const { application, entity, field } = match?.params ?? {};

  if (!application) {
    throw new Error("application parameters is required in the query string");
  }

  const { data, error: loadingError, loading } = useQuery<TData>(
    GET_ENTITY_FIELD,
    {
      variables: {
        entity,
        field,
      },
    }
  );

  const entityField = data?.entity.fields?.[0];

  const [updateEntityField, { error: updateError }] = useMutation<UpdateData>(
    UPDATE_ENTITY_FIELD,
    {
      onCompleted: (data) => {
        pendingChangesContext.addEntity(entity);
        trackEvent({
          eventName: "updateEntityField",
          entityFieldName: data.updateEntityField.displayName,
          dataType: data.updateEntityField.dataType,
        });
      },
    }
  );

  const handleDeleteField = useCallback(() => {
    history.push(`/${application}/entities/${entity}/fields/`);
  }, [history, application, entity]);

  const handleSubmit = useCallback(
    (data) => {
      const { id, ...rest } = data;
      updateEntityField({
        variables: {
          where: {
            id: field,
          },
          data: rest,
        },
      }).catch(console.error);
    },
    [updateEntityField, field]
  );

  const hasError =
    Boolean(error) || Boolean(updateError) || Boolean(loadingError);
  const errorMessage =
    formatError(error) || formatError(updateError) || formatError(loadingError);

  const defaultValues = useMemo(
    () =>
      entityField && {
        ...entityField,
        properties: entityField.properties,
      },
    [entityField]
  );

  return (
    <div className={CLASS_NAME}>
      {!loading && (
        <>
          <div className={`${CLASS_NAME}__header`}>
            <h3>Field Settings</h3>
            {entity && entityField && (
              <DeleteEntityField
                entityId={entity}
                entityField={entityField}
                showLabel
                onDelete={handleDeleteField}
                onError={setError}
              />
            )}
          </div>
          <EntityFieldForm
            isDisabled={
              defaultValues && SYSTEM_DATA_TYPES.has(defaultValues.dataType)
            }
            onSubmit={handleSubmit}
            defaultValues={defaultValues}
            applicationId={application}
          />
        </>
      )}
      <Snackbar open={hasError} message={errorMessage} />
    </div>
  );
};

export default EntityField;

const GET_ENTITY_FIELD = gql`
  query getEntityField($entity: String!, $field: String) {
    entity(where: { id: $entity }) {
      id
      displayName
      fields(where: { id: { equals: $field } }) {
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
  }
`;

const UPDATE_ENTITY_FIELD = gql`
  mutation updateEntityField(
    $data: EntityFieldUpdateInput!
    $where: WhereUniqueInput!
  ) {
    updateEntityField(data: $data, where: $where) {
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
