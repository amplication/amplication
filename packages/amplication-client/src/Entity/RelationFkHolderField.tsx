import { SelectField, SelectFieldProps } from "@amplication/ui/design-system";
import { useQuery } from "@apollo/client";
import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";
import * as models from "../models";
import { GET_ENTITY_FIELD_BY_PERMANENT_ID } from "./RelatedEntityFieldField";

type Props = Omit<SelectFieldProps, "options"> & {
  entity: models.Entity;
};

const RelationFkHolderField = ({ entity, ...props }: Props) => {
  const formik = useFormikContext<models.EntityField>();

  const entityFieldRef: React.MutableRefObject<{
    relatedField: models.EntityField | undefined;
    isOneToOne: boolean;
    entityListOptions: { value: string; label: string }[];
  }> = useRef({
    relatedField: undefined,
    isOneToOne: false,
    entityListOptions: [],
  });
  const { data } = useQuery<{ entity: models.Entity }>(
    GET_ENTITY_FIELD_BY_PERMANENT_ID,
    {
      variables: {
        entityId: formik.values.properties.relatedEntityId,
        fieldPermanentId: formik.values.properties.relatedFieldId,
      },
      skip:
        !formik.values.properties?.relatedEntityId ||
        !formik.values.properties?.relatedFieldId,
    }
  );

  useEffect(() => {
    if (!data) {
      entityFieldRef.current = {
        relatedField: undefined,
        isOneToOne: false,
        entityListOptions: [],
      };
      return;
    }

    const relatedField =
      (data.entity?.fields &&
        data.entity.fields.length &&
        data.entity.fields[0]) ||
      undefined;

    entityFieldRef.current = {
      relatedField,
      isOneToOne:
        !formik.values?.properties?.allowMultipleSelection &&
        !relatedField.properties?.allowMultipleSelection,
      entityListOptions: [
        {
          value: formik.values.permanentId,
          label: `${entity.displayName} (this side)`,
        },
        {
          value: relatedField.permanentId,
          label: `${data.entity.displayName} (Other side)`,
        },
      ],
    };
  }, [data, formik.values]);

  return !entityFieldRef.current.isOneToOne ? null : (
    <SelectField
      {...props}
      options={entityFieldRef.current.entityListOptions}
    />
  );
};

export default RelationFkHolderField;
