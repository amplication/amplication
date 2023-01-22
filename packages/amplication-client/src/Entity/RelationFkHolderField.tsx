import { SelectField, SelectFieldProps } from "@amplication/design-system";
import { useQuery } from "@apollo/client";
import { useFormikContext } from "formik";
import { useMemo } from "react";
import * as models from "../models";
import { GET_ENTITY_FIELD_BY_PERMANENT_ID } from "./RelatedEntityFieldField";

type Props = Omit<SelectFieldProps, "options"> & {
  entity: models.Entity;
};

const RelationFkHolderField = ({ entity, ...props }: Props) => {
  const formik = useFormikContext<models.EntityField>();

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

  const relatedField =
    data &&
    data.entity &&
    data.entity.fields &&
    data.entity.fields.length &&
    data.entity.fields[0];

  const isOneToOne = useMemo(() => {
    return (
      entity &&
      data &&
      !formik.values?.properties?.allowMultipleSelection &&
      !relatedField.properties?.allowMultipleSelection
    );
  }, [data, formik.values]);

  const entityListOptions = useMemo(() => {
    return (
      (entity &&
        data && [
          {
            value: formik.values.permanentId,
            label: `${entity.displayName} (this side)`,
          },
          {
            value: relatedField.permanentId,
            label: `${data.entity.displayName} (Other side)`,
          },
        ]) ||
      []
    );
  }, [data]);

  if (!isOneToOne) return null;

  return <SelectField {...props} options={entityListOptions} />;
};

export default RelationFkHolderField;
