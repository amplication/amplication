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
  isValueId: boolean;
};

const EntitySelectField = ({ resourceId, isValueId, ...props }: Props) => {
  const { data: entityList } = useQuery<TEntities>(GET_ENTITIES, {
    variables: {
      resourceId: resourceId,
    },
  });

  const entityListOptions = useMemo(() => {
    return entityList
      ? entityList.entities.map((entity) => ({
          value: isValueId ? entity.id : entity.displayName,
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
