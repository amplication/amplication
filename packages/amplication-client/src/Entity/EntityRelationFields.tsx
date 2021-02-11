import { Icon } from "@rmwc/icon";
import classNames from "classnames";
import { Formik } from "formik";
import { isEmpty } from "lodash";
import React from "react";
import { Button, EnumButtonStyle } from "../Components/Button";
import { DisplayNameField } from "../Components/DisplayNameField";
import { Form } from "../Components/Form";
import * as models from "../models";
import "./EntityRelationFields.scss";

export type FormValues = {
  fieldId: string;
  relatedFieldDisplayName: string;
};

type Props = {
  field: models.EntityField;
  entityName: string;
  relatedEntityName: string;
  relatedFieldName: string;
  onSubmit: (data: FormValues) => void;
};

const CLASS_NAME = "entity-relation-fields";

export const EntityRelationFields = ({
  field,
  entityName,
  relatedEntityName,
  relatedFieldName,
  onSubmit,
}: Props) => {
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
          className={classNames(`${CLASS_NAME}`, {
            [`${CLASS_NAME}--missing`]: relatedFieldIsMissing,
          })}
          key={field.id}
        >
          <div className={`${CLASS_NAME}__entity`}>
            <Icon icon="entity_outline" />
            {entityName}
          </div>
          <div className={`${CLASS_NAME}__field`}>{field.displayName}</div>
          <div className={`${CLASS_NAME}__status`}>
            {relatedFieldIsMissing ? (
              <Icon icon="info_circle" />
            ) : (
              <Icon icon="check_circle" />
            )}
          </div>
          <div className={`${CLASS_NAME}__entity`}>
            <Icon icon="entity_outline" />
            {relatedEntityName}
          </div>
          <div className={`${CLASS_NAME}__field ${CLASS_NAME}__field--target`}>
            {relatedFieldIsMissing ? (
              <DisplayNameField
                className={`${CLASS_NAME}__field__textbox`}
                name="relatedFieldDisplayName"
                placeholder="Display name for the new field"
                required
              />
            ) : (
              relatedFieldName
            )}
          </div>
          <Button
            className={`${CLASS_NAME}__fix`}
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
