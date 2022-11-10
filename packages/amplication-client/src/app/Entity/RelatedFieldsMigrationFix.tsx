import {
  Panel,
  PanelHeader,
  Snackbar,
  CircularProgress,
} from "@amplication/design-system";
import { gql, useMutation, useQuery } from "@apollo/client";
import { camelCase } from "camel-case";
import { keyBy } from "lodash";
import React, { useCallback, useContext, useMemo } from "react";
import { match } from "react-router-dom";
import { AppContext } from "../context/appContext";
import PageContent from "../Layout/PageContent";
import useNavigationTabs from "../Layout/UseNavigationTabs";
import * as models from "../models";
import { formatError } from "../util/error";
import {
  EntityRelationFieldsChart,
  FormValues,
} from "./EntityRelationFieldsChart";
import "./RelatedFieldsMigrationFix.scss";

type TData = {
  resource: models.Resource;
};

type Props = {
  match: match<{ resource: string }>;
};

const CLASS_NAME = "related-fields-migration-fix";
const NAVIGATION_KEY = "FIX_RELATED_ENTITIES";

export const RelatedFieldsMigrationFix = ({ match }: Props) => {
  const resourceId = match.params.resource;
  const { addEntity } = useContext(AppContext);
  const pageTitle = "Fix Entity Relations";
  useNavigationTabs(
    resourceId,
    NAVIGATION_KEY,
    match.url,
    pageTitle
  );

  const { data, loading, error, refetch } = useQuery<TData>(GET_LOOKUP_FIELDS, {
    variables: {
      resourceId: resourceId,
    },
  });

  const [createDefaultRelatedEntity, { error: createError }] = useMutation<{
    createDefaultRelatedField: models.EntityField;
  }>(CREATE_DEFAULT_RELATED_ENTITY, {
    onCompleted: (createData) => {
      refetch();
      addEntity(
        createData.createDefaultRelatedField.properties.relatedEntityId
      );

      const entity = data?.resource.entities.find((entity) =>
        entity.fields?.some(
          (field) => field.id === createData.createDefaultRelatedField.id
        )
      );
      if (entity) {
        addEntity(entity.id);
      }
    },
  });

  const handleRelatedFieldFormSubmit = useCallback(
    (relatedFieldValues: FormValues) => {
      createDefaultRelatedEntity({
        variables: {
          fieldId: relatedFieldValues.fieldId,
          relatedFieldDisplayName: relatedFieldValues.relatedFieldDisplayName,
          relatedFieldName: camelCase(
            relatedFieldValues.relatedFieldDisplayName
          ),
        },
      }).catch(console.error);
    },
    [createDefaultRelatedEntity]
  );

  const entityDictionary = useMemo(() => {
    return keyBy(data?.resource.entities, (entity) => entity.id);
  }, [data]);

  const fieldDictionary = useMemo(() => {
    const allFields =
      data?.resource.entities.flatMap((entity) => entity.fields || []) || [];

    const d = keyBy(allFields, (field) => field.permanentId);
    console.log(d);
    return d;
  }, [data]);

  const errorMessage =
    (error && formatError(error)) || (createError && formatError(createError));

  return (
    <PageContent className={CLASS_NAME} pageTitle={pageTitle}>
      <h2>New Release Updates</h2>
      <div className={`${CLASS_NAME}__message`}>
        Version 0.3.2 includes big improvements in how we manage related
        entities. The changes require your attention. <br />
        Following is a list of all the entities in your resource, please provide
        the missing names for each of your existing relation fields.
        <span className={`${CLASS_NAME}__highlight`}>
          {" "}
          It will only take you a minute!
        </span>
      </div>
      {loading && <CircularProgress />}
      {data?.resource.entities?.map((entity) => (
        <Panel className={`${CLASS_NAME}__entity`} key={entity.id}>
          <PanelHeader>{entity.displayName}</PanelHeader>
          <div className={`${CLASS_NAME}__entity__fields`}>
            {entity.fields && entity.fields.length
              ? entity.fields?.map((field) => (
                  <EntityRelationFieldsChart
                    key={field.id}
                    fixInPlace
                    resourceId={resourceId}
                    entityId={entity.id}
                    entityName={entity.displayName}
                    field={field}
                    relatedField={
                      fieldDictionary[field.properties.relatedFieldId]
                    }
                    relatedEntityName={
                      entityDictionary[field.properties.relatedEntityId]
                        .displayName
                    }
                    onSubmit={handleRelatedFieldFormSubmit}
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
    </PageContent>
  );
};

export const GET_LOOKUP_FIELDS = gql`
  query getResourceLookupFields($resourceId: String!) {
    resource(where: { id: $resourceId }) {
      id
      name
      entities(orderBy: { displayName: Asc }) {
        id
        name
        displayName
        pluralDisplayName
        fields(
          where: { dataType: { equals: Lookup } }
          orderBy: { displayName: Asc }
        ) {
          id
          permanentId
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
