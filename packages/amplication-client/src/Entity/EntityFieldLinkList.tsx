import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Snackbar } from "@rmwc/snackbar";
import { formatError } from "../util/error";
import * as models from "../models";
import InnerTabLink from "../Layout/InnerTabLink";
import { DATA_TYPE_TO_LABEL_AND_ICON } from "./constants";
import NewEntityField from "./NewEntityField";

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
  const history = useHistory();
  const handleFieldAdd = useCallback(
    (field: models.EntityField) => {
      const fieldUrl = `/${data?.entity.appId}/entities/${entityId}/fields/${field.id}`;
      history.push(fieldUrl);
    },
    [data, history, entityId]
  );

  const errorMessage = formatError(error);

  return (
    <>
      {data?.entity.fields?.map((field) => (
        <div key={field.id}>
          <InnerTabLink
            icon={DATA_TYPE_TO_LABEL_AND_ICON[field.dataType].icon}
            to={`/${data?.entity.appId}/entities/${data?.entity.id}/fields/${field.id}`}
          >
            <span>{field.displayName}</span>
          </InnerTabLink>
        </div>
      ))}
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
      appId
      fields(where: { displayName: $whereName }, orderBy: $orderBy) {
        id
        displayName
        name
        dataType
        required
        unique
        searchable
        description
        properties
      }
    }
  }
`;
