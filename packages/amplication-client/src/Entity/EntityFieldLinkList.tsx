import React, { useCallback } from "react";
import { useHistory, Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Snackbar } from "@rmwc/snackbar";
import { formatError } from "../util/error";
import * as models from "../models";

import NewEntityField from "./NewEntityField";

type TData = {
  entity: models.Entity;
};

const DATE_CREATED_FIELD = "createdAt";

type Props = {
  entityId: string;
};

export const EntityFieldLinkList = React.memo(({ entityId }: Props) => {
  const history = useHistory();

  const { data, loading, error } = useQuery<TData>(GET_FIELDS, {
    variables: {
      id: entityId,
      orderBy: {
        [DATE_CREATED_FIELD]: models.SortOrder.Asc,
      },
    },
  });

  const errorMessage = formatError(error);

  const handleFieldAdd = useCallback(
    (field: models.EntityField) => {
      const fieldUrl = `/${data?.entity.appId}/entities/${entityId}/fields/${field.id}`;
      history.push(fieldUrl);
    },
    [data, history, entityId]
  );

  return (
    <>
      {data?.entity && (
        <NewEntityField onFieldAdd={handleFieldAdd} entity={data?.entity} />
      )}
      {data?.entity.fields?.map((field) => (
        <div>
          <Link
            title={field.displayName}
            to={`/${data?.entity.appId}/entities/${data?.entity.id}/fields/${field.id}`}
          >
            <span>{field.displayName}</span>
          </Link>
        </div>
      ))}
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
      appId
      fields(where: { displayName: $whereName }, orderBy: $orderBy) {
        id
        displayName
        name
        dataType
        required
        searchable
        description
        properties
      }
    }
  }
`;
