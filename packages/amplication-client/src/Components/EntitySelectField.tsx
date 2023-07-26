import React, { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import { SelectField, SelectFieldProps } from "@amplication/ui/design-system";

type TEntities = {
  entities: [
    {
      id: string;
      displayName: string;
    }
  ];
};

type Props = Omit<SelectFieldProps, "options"> & {
  resourceId: string;
};

const EntitySelectField = ({ resourceId, ...props }: Props) => {
  const { data: entityList } = useQuery<TEntities>(
    GET_ENTITIES_FOR_ENTITY_SELECT_FIELD,
    {
      variables: {
        resourceId: resourceId,
      },
      fetchPolicy: "no-cache",
    }
  );

  const entityListOptions = useMemo(() => {
    return entityList
      ? entityList.entities.map((entity) => ({
          value: entity.id,
          label: entity.displayName,
        }))
      : [];
  }, [entityList]);

  return <SelectField {...props} options={entityListOptions} />;
};

export default EntitySelectField;

export const GET_ENTITIES_FOR_ENTITY_SELECT_FIELD = gql`
  query getEntities($resourceId: String!) {
    entities(where: { resource: { id: $resourceId } }) {
      id
      displayName
    }
  }
`;
