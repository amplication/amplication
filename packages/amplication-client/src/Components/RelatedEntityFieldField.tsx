import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useFormikContext } from "formik";
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

  return (
    (data && data.entity && data.entity.fields && (
      <div className={CLASS_NAME}>
        <label>Related Field</label>

        <Link
          to={`/${data.entity.appId}/entities/${data.entity.id}/fields/${data.entity.fields[0].id}`}
        >
          {data.entity.fields[0].displayName}
        </Link>
      </div>
    )) ||
    null
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
      appId
      fields(where: { permanentId: { equals: $fieldPermanentId } }) {
        id
        displayName
      }
    }
  }
`;
