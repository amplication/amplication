import React, { useCallback, useContext, useMemo } from "react";
import { match } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import { camelCase } from "camel-case";
import classNames from "classnames";
import { Formik } from "formik";
import { Form } from "../Components/Form";
import { Icon } from "@rmwc/icon";
import { keyBy, Dictionary, isEmpty } from "lodash";
import { Snackbar } from "@rmwc/snackbar";
import { CircularProgress } from "@rmwc/circular-progress";
import { DisplayNameField } from "../Components/DisplayNameField";
import { formatError } from "../util/error";
import * as models from "../models";
import { Button, EnumButtonStyle } from "../Components/Button";
import { Panel, PanelHeader } from "@amplication/design-system";
import PendingChangesContext from "../VersionControl/PendingChangesContext";
import useNavigationTabs from "../Layout/UseNavigationTabs";
import PageContent from "../Layout/PageContent";
import "./RelatedFieldsMigrationFix.scss";

type TData = {
  app: models.App;
};

type Props = {
  match: match<{ application: string }>;
};

const CLASS_NAME = "related-fields-migration-fix";
const NAVIGATION_KEY = "FIX_RELATED_ENTITIES";

export const RelatedFieldsMigrationFix = ({ match }: Props) => {
  const applicationId = match.params.application;
  const pendingChangesContext = useContext(PendingChangesContext);

  useNavigationTabs(
    applicationId,
    NAVIGATION_KEY,
    match.url,
    "Fix Entity Relations"
  );

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
    return keyBy(data?.app.entities, (entity) => entity.id);
  }, [data]);

  const fieldDictionary = useMemo(() => {
    const allFields =
      data?.app.entities.flatMap((entity) => entity.fields || []) || [];

    const d = keyBy(allFields, (field) => field.permanentId);
    console.log(d);
    return d;
  }, [data]);

  const errorMessage =
    (error && formatError(error)) || (createError && formatError(createError));

  return (
    <PageContent className={CLASS_NAME}>
      <h2>New Release Updates</h2>
      <div className={`${CLASS_NAME}__message`}>
        Version 0.3.2 includes big improvements in how we manage related
        entities. The changes require your attention. <br />
        Following is a list of all the entities in your app, please provide the
        missing names for each of your existing relation fields.
        <span className={`${CLASS_NAME}__highlight`}>
          {" "}
          It will only take you a minute!
        </span>
      </div>
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
                    entityDictionary={entityDictionary}
                    fieldDictionary={fieldDictionary}
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

type FormValues = {
  fieldId: string;
  relatedFieldDisplayName: string;
};

const RelatedFieldsMigrationFixField = ({
  entity,
  field,
  entityDictionary,
  fieldDictionary,
  onSubmit,
}: {
  entity: models.Entity;
  field: models.EntityField;
  entityDictionary: Dictionary<models.Entity>;
  fieldDictionary: Dictionary<models.EntityField>;
  onSubmit: (data: FormValues) => void;
}) => {
  const initialValues: FormValues = {
    relatedFieldDisplayName: "",
    fieldId: field.id,
  };

  const relatedFieldIsMissing = isEmpty(field.properties.relatedFieldId);

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValues}
      enableReinitialize
    >
      <Form>
        <div
          className={classNames(`${CLASS_NAME}__relation`, {
            [`${CLASS_NAME}__relation--missing`]: relatedFieldIsMissing,
          })}
          key={field.id}
        >
          <div className={`${CLASS_NAME}__relation__entity`}>
            <Icon icon="entity_outline" />
            {entity.displayName}
          </div>
          <div className={`${CLASS_NAME}__relation__field`}>
            {field.displayName}
          </div>
          <div className={`${CLASS_NAME}__relation__status`}>
            {relatedFieldIsMissing ? (
              <Icon icon="info_circle" />
            ) : (
              <Icon icon="check_circle" />
            )}
          </div>
          <div className={`${CLASS_NAME}__relation__entity`}>
            <Icon icon="entity_outline" />
            {entityDictionary[field.properties.relatedEntityId].displayName}
          </div>
          <div
            className={`${CLASS_NAME}__relation__field ${CLASS_NAME}__relation__field--target`}
          >
            {relatedFieldIsMissing ? (
              <DisplayNameField
                className={`${CLASS_NAME}__relation__field__textbox`}
                name="relatedFieldDisplayName"
                placeholder="Display name for the new field"
                required
              />
            ) : (
              fieldDictionary[field.properties.relatedFieldId]?.displayName
            )}
          </div>
          <Button
            className={`${CLASS_NAME}__relation__fix`}
            buttonStyle={EnumButtonStyle.Secondary}
            type="submit"
            eventData={{
              eventName: "fixRelatedEntity",
              fieldId: field.id,
            }}
          >
            Fix Relation
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export const GET_LOOKUP_FIELDS = gql`
  query getAppLookupFields($appId: String!) {
    app(where: { id: $appId }) {
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
