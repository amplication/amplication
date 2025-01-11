import { Form, Icon } from "@amplication/ui/design-system";
import classNames from "classnames";
import { Formik } from "formik";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
import * as models from "../models";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";
import "./EntityRelationFieldsChart.scss";

export type FormValues = {
  fieldId: string;
  relatedFieldDisplayName: string;
};

type Props = {
  resourceId: string;
  entityId: string;
  field: models.EntityField;
  entityName: string;
  relatedEntityName: string;
  relatedField: models.EntityField;
  onSubmit: (data: FormValues) => void;
};

const CLASS_NAME = "entity-relation-fields-chart";

export const EntityRelationFieldsChart = ({
  resourceId,
  entityId,
  field,
  entityName,
  relatedEntityName,
  relatedField,
  onSubmit,
}: Props) => {
  const initialValues: FormValues = {
    relatedFieldDisplayName: "",
    fieldId: field.id,
  };

  const relatedFieldIsMissing = isEmpty(field.properties.relatedFieldId);

  const { baseUrl } = useResourceBaseUrl({ overrideResourceId: resourceId });

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
            <Link to={`${baseUrl}/entities/${entityId}`}>
              <Icon icon="entity_outline" />
              {entityName}
            </Link>
          </div>
          <div className={`${CLASS_NAME}__field`}>
            <Link to={`${baseUrl}/entities/${entityId}`}>
              {field.displayName}
            </Link>
          </div>
          <div className={`${CLASS_NAME}__status`}>
            <span
              className={`${CLASS_NAME}__status__cardinality--source ${CLASS_NAME}__status__cardinality--${
                relatedField?.properties?.allowMultipleSelection
                  ? "many"
                  : "one"
              }`}
            />
            {relatedFieldIsMissing ? (
              <Icon icon="info_circle" />
            ) : (
              <Icon icon="check_circle" />
            )}
            <span
              className={`${CLASS_NAME}__status__cardinality--target ${CLASS_NAME}__status__cardinality--${
                field.properties.allowMultipleSelection ? "many" : "one"
              }`}
            />
          </div>
          <div className={`${CLASS_NAME}__entity`}>
            <Link
              to={`${baseUrl}/entities/${field.properties.relatedEntityId}`}
            >
              <Icon icon="entity_outline" />
              {relatedEntityName}
            </Link>
          </div>
          <div className={`${CLASS_NAME}__field ${CLASS_NAME}__field--target`}>
            {relatedFieldIsMissing ? (
              <Link
                className={`${CLASS_NAME}__field__textbox`}
                to={`${baseUrl}/fix-related-entities`}
              >
                Fix it
              </Link>
            ) : (
              <Link
                to={`${baseUrl}/entities/${field.properties.relatedEntityId}/fields/${relatedField?.id}`}
              >
                {relatedField?.displayName}
              </Link>
            )}
          </div>
        </div>
      </Form>
    </Formik>
  );
};
