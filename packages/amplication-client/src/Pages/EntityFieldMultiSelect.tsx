import React, { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  CheckboxListField,
  CheckboxListFieldProps,
} from "@amplication/design-system";

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

type Props = Omit<CheckboxListFieldProps, "options"> & {
  entityId: string;
  name: string;
};

const EntityFieldMultiSelect = ({ entityId, name, ...rest }: Props) => {
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

  return <CheckboxListField {...rest} options={options} name={name} />;
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
