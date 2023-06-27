import React, { useEffect } from "react";
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

type RelatedEntityOption = {
  value: string;
  label: string;
};

type Props = Omit<SelectFieldProps, "options"> & {
  resourceId: string;
};

const EntitySelectField = ({ resourceId, ...props }: Props) => {
  const [relatedEntityListOptions, setRelatedEntityListOptions] =
    React.useState<RelatedEntityOption[]>([]);
  const { data: entityList } = useQuery<TEntities>(GET_ENTITIES, {
    variables: {
      resourceId: resourceId,
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (!entityList) return;

    const relatedEntityOptions = entityList.entities.map((entity) => ({
      value: entity.id,
      label: entity.displayName,
    }));

    setRelatedEntityListOptions(relatedEntityOptions);
  }, [entityList]);

  return <SelectField {...props} options={relatedEntityListOptions} />;
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
