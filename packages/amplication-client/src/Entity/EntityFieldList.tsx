import {
  CircularProgress,
  EnumFlexItemMargin,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  List,
  SearchField,
  Snackbar,
  TabContentTitle,
  Text,
} from "@amplication/ui/design-system";
import { gql, useQuery } from "@apollo/client";
import React, { useCallback, useMemo, useState } from "react";
import * as models from "../models";
import { formatError } from "../util/error";

import { pluralize } from "../util/pluralize";
import { EntityFieldListItem } from "./EntityFieldListItem";
import { GET_ENTITIES } from "./EntityList";

type TData = {
  entity: models.Entity;
};

const DATE_CREATED_FIELD = "createdAt";

type Props = {
  entityId: string;
  entityName: string;
};

const EntityFieldList = React.memo(({ entityId, entityName }: Props) => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [error, setError] = useState<Error>();

  const {
    data,
    loading,
    error: errorLoading,
  } = useQuery<TData>(GET_FIELDS, {
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
      <Text textColor={EnumTextColor.Primary}>{`${entityName} entity`}</Text>
      <TabContentTitle title="Entity Fields" subTitle="" />
      <SearchField
        label="search"
        placeholder="Search"
        onChange={handleSearchChange}
      />
      <FlexItem margin={EnumFlexItemMargin.Both}>
        <Text textStyle={EnumTextStyle.Tag}>
          {data?.entity.fields?.length}{" "}
          {pluralize(data?.entity.fields?.length, "Field", "Fields")}
        </Text>
      </FlexItem>
      {loading && <CircularProgress centerToParent />}
      <List>
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
      </List>
      <Snackbar open={Boolean(error || errorLoading)} message={errorMessage} />
    </>
  );
});

export default EntityFieldList;

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
