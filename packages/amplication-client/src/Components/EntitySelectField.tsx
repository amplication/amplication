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
  applicationId: string;
};

const EntitySelectField = ({ applicationId, ...props }: Props) => {
  const { data: entityList } = useQuery<TEntities>(GET_ENTITIES, {
    variables: {
      appId: applicationId,
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
  query getEntities($appId: String!) {
    entities(where: { app: { id: $appId } }) {
      id
      displayName
    }
  }
`;
