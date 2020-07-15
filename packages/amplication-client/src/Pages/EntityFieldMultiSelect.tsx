import React, { useMemo } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { CheckboxListField } from "../Components/CheckboxListField";

type TPages = {
  entity: {
    fields: [
      {
        name: string;
        displayName: string;
      }
    ];
  };
};

type Props = {
  entityId: string;
  name: string;
};

const EntityFieldMultiSelect = ({ entityId, name }: Props) => {
  const { data } = useQuery<TPages>(GET_ENTITY_FIELDS, {
    variables: {
      entityId: entityId,
    },
  });

  const options = useMemo(() => {
    return data
      ? data.entity.fields.map((field) => ({
          value: field.name,
          label: field.displayName,
        }))
      : [];
  }, [data]);

  return <CheckboxListField options={options} name={name} />;
};

export default EntityFieldMultiSelect;

export const GET_ENTITY_FIELDS = gql`
  query getPages($entityId: String!) {
    entity(where: { id: $entityId }) {
      fields {
        name
        displayName
      }
    }
  }
`;
