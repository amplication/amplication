import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useFormikContext } from "formik";
import { Icon } from "@rmwc/icon";
import { Link } from "react-router-dom";
import * as models from "../models";
import "./RelatedEntityFieldField.scss";

const CLASS_NAME = "related-entity-field-field";

const RelatedEntityFieldField = () => {
  const formik = useFormikContext<{
    id: string;
    properties: {
      relatedEntityId: string;
      relatedFieldId: string;
    };
  }>();

  const { data } = useQuery<{ entity: models.Entity }>(
    GET_ENTITY_FIELD_BY_PERMANENT_ID,
    {
      variables: {
        entityId: formik.values.properties.relatedEntityId,
        fieldPermanentId: formik.values.properties.relatedFieldId,
      },
    }
  );

  const relatedField =
    data &&
    data.entity &&
    data.entity.fields &&
    data.entity.fields.length &&
    data.entity.fields[0];

  return (
    <div className={CLASS_NAME}>
      {formik.values.properties.relatedFieldId ? (
        data &&
        relatedField && (
          <Link
            to={`/${data.entity.appId}/entities/${data.entity.id}/fields/${relatedField.id}`}
          >
            This field is related to field
            <span className={`${CLASS_NAME}__highlight`}>
              {" "}
              {relatedField.displayName}
            </span>{" "}
            on entity{" "}
            <span className={`${CLASS_NAME}__highlight`}>
              {data.entity.displayName}
            </span>
          </Link>
        )
      ) : (
        <div className={`${CLASS_NAME}__error`}>
          <Icon icon="info_circle" />
          <span>This field is missing the opposite related field </span>
          <Link to={`/${data?.entity?.appId}/fix-related-entities`}>
            You can fix it here
          </Link>
        </div>
      )}
    </div>
  );
};

export default RelatedEntityFieldField;

export const GET_ENTITY_FIELD_BY_PERMANENT_ID = gql`
  query GetEntityFieldByPermanentId(
    $entityId: String!
    $fieldPermanentId: String
  ) {
    entity(where: { id: $entityId }) {
      id
      displayName
      appId
      fields(where: { permanentId: { equals: $fieldPermanentId } }) {
        id
        displayName
      }
    }
  }
`;
