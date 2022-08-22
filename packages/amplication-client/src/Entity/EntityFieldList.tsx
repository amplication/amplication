import React, { useState, useCallback, useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import { formatError } from "../util/error";
import * as models from "../models";
import {
  SearchField,
  Snackbar,
  CircularProgress,
} from "@amplication/design-system";

import { EntityFieldListItem } from "./EntityFieldListItem";
import { GET_ENTITIES } from "./EntityList";
import "./EntityFieldList.scss";

type TData = {
  entity: models.Entity;
};

const DATE_CREATED_FIELD = "createdAt";
const CLASS_NAME = "entity-field-list";

type Props = {
  entityId: string;
};

const EntityFieldList = React.memo(({ entityId }: Props) => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [error, setError] = useState<Error>();

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
      id: data?.entity.resourceId,
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

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );

  const errorMessage =
    formatError(errorLoading) || (error && formatError(error));

  return (
    <>
      <div className={`${CLASS_NAME}__header`}>
        <SearchField
          label="search"
          placeholder="search"
          onChange={handleSearchChange}
        />
      </div>
      <div className={`${CLASS_NAME}__title`}>
        {data?.entity.fields?.length} Fields
      </div>
      {loading && <CircularProgress />}
      {data?.entity.fields?.map((field) => (
        <EntityFieldListItem
          key={field.id}
          resourceId={data?.entity.resourceId}
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

export default EntityFieldList;

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
        description
        properties
      }
    }
  }
`;
