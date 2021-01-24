import React, { useCallback, useMemo } from "react";
import { useRouteMatch } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";

import { formatError } from "../util/error";
import EntityFieldForm from "./EntityFieldForm";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import SidebarHeader from "../Layout/SidebarHeader";
import { SYSTEM_DATA_TYPES } from "./constants";

type TData = {
  entity: models.Entity;
};

type UpdateData = {
  updateEntityField: models.EntityField;
};

const EntityField = () => {
  const { trackEvent } = useTracking();

  const match = useRouteMatch<{
    application: string;
    entity: string;
    field: string;
  }>("/:application/entities/:entity/fields/:field");

  const { application, entity, field } = match?.params ?? {};

  if (!application) {
    throw new Error("application parameters is required in the query string");
  }

  const { data, error, loading } = useQuery<TData>(GET_ENTITY_FIELD, {
    variables: {
      entity,
      field,
    },
  });

  const entityField = data?.entity.fields?.[0];

  const [updateEntityField, { error: updateError }] = useMutation<UpdateData>(
    UPDATE_ENTITY_FIELD,
    {
      onCompleted: (data) => {
        trackEvent({
          eventName: "updateEntityField",
          entityFieldName: data.updateEntityField.displayName,
          dataType: data.updateEntityField.dataType,
        });
      },
    }
  );

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

  const hasError = Boolean(error) || Boolean(updateError);
  const errorMessage = formatError(error) || formatError(updateError);

  const defaultValues = useMemo(
    () =>
      entityField && {
        ...entityField,
        properties: entityField.properties,
      },
    [entityField]
  );

  return (
    <>
      {!loading && (
        <EntityFieldForm
          isDisabled={
            defaultValues && SYSTEM_DATA_TYPES.has(defaultValues.dataType)
          }
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          applicationId={application}
        />
      )}
      <Snackbar open={hasError} message={errorMessage} />
    </>
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
