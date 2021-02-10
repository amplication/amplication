import React, { useState, useCallback, useContext } from "react";
import { match } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Icon } from "@rmwc/icon";
import { Snackbar } from "@rmwc/snackbar";
import { CircularProgress } from "@rmwc/circular-progress";
import { formatError } from "../util/error";
import * as models from "../models";
import { Button, EnumButtonStyle } from "../Components/Button";
import { Panel, PanelHeader } from "@amplication/design-system";
import PendingChangesContext from "../VersionControl/PendingChangesContext";
import {
  RelatedFieldDialog,
  Values as RelatedFieldValues,
} from "./RelatedFieldDialog";
import "./RelatedFieldsMigrationFix.scss";

type TData = {
  app: models.App;
};

type Props = {
  match: match<{ application: string }>;
};

const CLASS_NAME = "related-fields-migration-fix";

export const RelatedFieldsMigrationFix = ({ match }: Props) => {
  const applicationId = match.params.application;
  const pendingChangesContext = useContext(PendingChangesContext);

  const [selectedFieldData, setSelectedFieldData] = useState<{
    entity: models.Entity;
    field: models.EntityField;
  } | null>(null);

  const { data, loading, error, refetch } = useQuery<TData>(GET_LOOKUP_FIELDS, {
    variables: {
      appId: applicationId,
    },
  });

  const [createDefaultRelatedEntity, { error: createError }] = useMutation<{
    createDefaultRelatedField: models.EntityField;
  }>(CREATE_DEFAULT_RELATED_ENTITY, {
    onCompleted: (createData) => {
      refetch();
      pendingChangesContext.addEntity(
        createData.createDefaultRelatedField.properties.relatedEntityId
      );

      const entity = data?.app.entities.find((entity) =>
        entity.fields?.some(
          (field) => field.id === createData.createDefaultRelatedField.id
        )
      );
      if (entity) {
        pendingChangesContext.addEntity(entity.id);
      }
    },
  });

  const handleRelatedFieldFormSubmit = useCallback(
    (relatedFieldValues: RelatedFieldValues) => {
      if (!selectedFieldData) {
        throw new Error("selectedField must be defined");
      }
      const { field } = selectedFieldData;
      createDefaultRelatedEntity({
        variables: {
          fieldId: field.id,
          ...relatedFieldValues,
        },
      }).catch(console.error);

      setSelectedFieldData(null);
    },
    [createDefaultRelatedEntity, selectedFieldData]
  );

  const hideRelatedFieldDialog = useCallback(() => {
    setSelectedFieldData(null);
  }, [setSelectedFieldData]);

  const showRelatedFieldDialog = useCallback(
    (entity, field) => {
      setSelectedFieldData({ entity, field });
    },
    [setSelectedFieldData]
  );

  const errorMessage =
    (error && formatError(error)) || (createError && formatError(createError));

  return (
    <div className={CLASS_NAME}>
      {loading && <CircularProgress />}
      {data?.app.entities?.map((entity) => (
        <Panel className={`${CLASS_NAME}__entity`} key={entity.id}>
          <PanelHeader>{entity.displayName}</PanelHeader>

          <div className={`${CLASS_NAME}__entity__fields`}>
            {entity.fields && entity.fields.length
              ? entity.fields?.map((field) => (
                  <RelatedFieldsMigrationFixField
                    entity={entity}
                    field={field}
                    onClick={showRelatedFieldDialog}
                  />
                ))
              : "No relation fields"}
          </div>
        </Panel>
      ))}
      <Snackbar
        open={Boolean(error) || Boolean(createError)}
        message={errorMessage}
      />
      {selectedFieldData && (
        <RelatedFieldDialog
          isOpen={selectedFieldData !== null}
          onDismiss={hideRelatedFieldDialog}
          onSubmit={handleRelatedFieldFormSubmit}
          relatedEntityId={selectedFieldData.field.properties?.relatedEntityId}
          allowMultipleSelection={
            !selectedFieldData.field.properties?.allowMultipleSelection
          }
          entity={selectedFieldData.entity}
        />
      )}
    </div>
  );
};

const RelatedFieldsMigrationFixField = ({
  entity,
  field,
  onClick,
}: {
  entity: models.Entity;
  field: models.EntityField;
  onClick: (entity: models.Entity, field: models.EntityField) => void;
}) => {
  const handleClick = useCallback(() => {
    onClick(entity, field);
  }, [onClick, field, entity]);

  return (
    <div className={`${CLASS_NAME}__entity__field`} key={field.id}>
      {field.properties.relatedFieldId ? (
        <Icon icon="check_circle" />
      ) : (
        <>
          <Icon
            icon="info_circle"
            className={`${CLASS_NAME}__entity__field__error`}
          />
          <Button
            buttonStyle={EnumButtonStyle.Secondary}
            eventData={{
              eventName: "fixRelatedEntity",
              fieldId: field.id,
            }}
            onClick={handleClick}
          >
            Fix
          </Button>
        </>
      )}
      {field.displayName}
    </div>
  );
};

export const GET_LOOKUP_FIELDS = gql`
  query getAppLookupFields($appId: String!) {
    app(where: { id: $appId }) {
      id
      name
      entities {
        id
        name
        displayName
        pluralDisplayName
        fields(where: { dataType: { equals: Lookup } }) {
          id
          displayName
          name
          properties
        }
      }
    }
  }
`;

const CREATE_DEFAULT_RELATED_ENTITY = gql`
  mutation createDefaultRelatedEntity(
    $fieldId: String!
    $relatedFieldName: String
    $relatedFieldDisplayName: String
  ) {
    createDefaultRelatedField(
      where: { id: $fieldId }
      relatedFieldName: $relatedFieldName
      relatedFieldDisplayName: $relatedFieldDisplayName
    ) {
      id
      name
      displayName
      properties
    }
  }
`;
