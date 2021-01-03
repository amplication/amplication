import React, { useCallback, useMemo, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { types } from "@amplication/data";
import { DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";

import { formatError } from "../util/error";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import SidebarHeader from "../Layout/SidebarHeader";
import { SYSTEM_DATA_TYPES } from "./constants";
import EntityFieldForm, { Values } from "./EntityFieldForm";
import {
  RelatedFieldDialog,
  Values as RelatedFieldValues,
} from "./RelatedFieldDialog";

type TData = {
  entity: models.Entity;
};

type UpdateData = {
  updateEntityField: models.EntityField;
};

const EntityField = () => {
  const { trackEvent } = useTracking();
  const [lookupPendingData, setLookupPendingData] = useState<Values | null>(
    null
  );

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
      if (data.dataType === models.EnumDataType.Lookup) {
        const properties = data.properties as types.Lookup;
        if (
          entityField?.dataType !== models.EnumDataType.Lookup ||
          properties.relatedEntityId !== entityField?.properties.relatedEntityId
        ) {
          setLookupPendingData(data);
          return;
        }
      }
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
    [updateEntityField, field, entityField]
  );

  const handleRelatedFieldFormSubmit = useCallback(
    (relatedFieldValues: RelatedFieldValues) => {
      if (!lookupPendingData) {
        throw new Error("lookupPendingData must be defined");
      }
      const { id, ...rest } = lookupPendingData;
      updateEntityField({
        variables: {
          where: {
            id: field,
          },
          data: {
            ...rest,
            properties: {
              ...lookupPendingData.properties,
              relatedFieldId: undefined,
            },
          },
          ...relatedFieldValues,
        },
      }).catch(console.error);
      setLookupPendingData(null);
    },
    [updateEntityField, lookupPendingData, field]
  );

  const hideRelatedFieldDialog = useCallback(() => {
    setLookupPendingData(null);
  }, [setLookupPendingData]);

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
      <SidebarHeader showBack backUrl={`/${application}/entities/${entity}`}>
        {loading
          ? "Loading..."
          : `${data?.entity.displayName} | ${entityField?.displayName}`}
      </SidebarHeader>
      {!loading && (
        <DrawerContent>
          <EntityFieldForm
            isDisabled={
              defaultValues && SYSTEM_DATA_TYPES.has(defaultValues.dataType)
            }
            onSubmit={handleSubmit}
            defaultValues={defaultValues}
            applicationId={application}
          />
        </DrawerContent>
      )}
      {data && (
        <RelatedFieldDialog
          isOpen={lookupPendingData !== null}
          onDismiss={hideRelatedFieldDialog}
          onSubmit={handleRelatedFieldFormSubmit}
          relatedEntityId={lookupPendingData?.properties?.relatedEntityId}
          allowMultipleSelection={
            !lookupPendingData?.properties?.allowMultipleSelection
          }
          entity={data.entity}
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
      name
      displayName
      pluralDisplayName
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
    $relatedFieldName: String
    $relatedFieldDisplayName: String
  ) {
    updateEntityField(
      data: $data
      where: $where
      relatedFieldName: $relatedFieldName
      relatedFieldDisplayName: $relatedFieldDisplayName
    ) {
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
