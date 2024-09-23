import { Snackbar } from "@amplication/ui/design-system";
import { gql, useQuery } from "@apollo/client";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import InnerTabLink from "../Layout/InnerTabLink";
import * as models from "../models";
import { formatError } from "../util/error";
import { DATA_TYPE_TO_LABEL_AND_ICON } from "./constants";
import NewEntityField from "./NewEntityField";

import { useResourceBaseUrl } from "../util/useResourceBaseUrl";
import "./EntityFieldLinkList.scss";

const CLASS_NAME = "entity-field-link-list";

type TData = {
  entity: models.Entity;
};

const DATE_CREATED_FIELD = "createdAt";

type Props = {
  entityId: string;
};

export const EntityFieldLinkList = React.memo(({ entityId }: Props) => {
  const { data, error } = useQuery<TData>(GET_FIELDS, {
    variables: {
      id: entityId,
      orderBy: {
        [DATE_CREATED_FIELD]: models.SortOrder.Asc,
      },
    },
  });

  const { baseUrl } = useResourceBaseUrl({
    overrideResourceId: data?.entity.resourceId,
  });

  const history = useHistory();
  const handleFieldAdd = useCallback(
    (field: models.EntityField) => {
      const fieldUrl = `${baseUrl}/entities/${entityId}/fields/${field.id}`;
      history.push(fieldUrl);
    },
    [history, entityId, baseUrl]
  );

  const errorMessage = formatError(error);

  return (
    <>
      <div className={CLASS_NAME}>
        {data?.entity.fields?.map((field) => (
          <div key={field.id}>
            <InnerTabLink
              icon={DATA_TYPE_TO_LABEL_AND_ICON[field.dataType].icon}
              to={`${baseUrl}/entities/${data?.entity.id}/fields/${field.id}`}
            >
              <span>{field.displayName}</span>
            </InnerTabLink>
          </div>
        ))}
      </div>

      {data?.entity && (
        <NewEntityField onFieldAdd={handleFieldAdd} entity={data?.entity} />
      )}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
});
/**@todo: expand search on other field  */
export const GET_FIELDS = gql`
  query getEntityFields(
    $id: String!
    $orderBy: EntityFieldOrderByInput
    $whereName: StringFilter
  ) {
    entity(where: { id: $id }) {
      id
      resourceId
      fields(where: { displayName: $whereName }, orderBy: $orderBy) {
        id
        displayName
        name
        dataType
        required
        unique
        searchable
        customAttributes
        description
        properties
      }
    }
  }
`;
