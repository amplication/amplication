import React, { useState, useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Snackbar } from "@rmwc/snackbar";
import { formatError } from "../util/error";
import * as models from "../models";

import NewEntityField from "./NewEntityField";
import { EntityFieldListItem } from "./EntityFieldListItem";
import { GET_ENTITIES } from "./EntityList";

type TData = {
  entity: models.Entity;
};

const DATE_CREATED_FIELD = "createdAt";

type Props = {
  entityId: string;
};

export const EntityFieldList = React.memo(({ entityId }: Props) => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [error, setError] = useState<Error>();

  const handleSearchChange = (value: string) => {
    setSearchPhrase(value);
  };

  const history = useHistory();

  const { data, loading, error: errorLoading } = useQuery<TData>(GET_FIELDS, {
    variables: {
      id: entityId,
      orderBy: {
        [DATE_CREATED_FIELD]: models.SortOrder.Asc,
      },
      whereName:
        searchPhrase !== ""
          ? { contains: searchPhrase, mode: models.QueryMode.Insensitive }
          : undefined,
    },
  });

  const { data: entityList } = useQuery<{
    entities: models.Entity[];
  }>(GET_ENTITIES, {
    variables: {
      id: data?.entity.appId,
      orderBy: undefined,
      whereName: undefined,
    },
    skip: !data,
  });

  const entityIdToName = useMemo(() => {
    if (!entityList) return null;
    return Object.fromEntries(
      entityList.entities.map((entity) => [entity.id, entity.name])
    );
  }, [entityList]);

  const errorMessage =
    formatError(errorLoading) || (error && formatError(error));

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
        <EntityFieldListItem
          key={field.id}
          applicationId={data?.entity.appId}
          entity={data?.entity}
          entityField={field}
          entityIdToName={entityIdToName}
          onError={setError}
        />
      ))}
      <Snackbar open={Boolean(error || errorLoading)} message={errorMessage} />
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
