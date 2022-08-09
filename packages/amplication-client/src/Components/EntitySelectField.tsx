import React, { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import { SelectField, SelectFieldProps } from "@amplication/design-system";

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
  const { data: entityList } = useQuery<TEntities>(GET_ENTITIES, {
    variables: {
      resourceId: resourceId,
    },
  });

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

export const GET_ENTITIES = gql`
  query getEntities($resourceId: String!) {
    entities(where: { resource: { id: $resourceId } }) {
      id
      displayName
    }
  }
`;
