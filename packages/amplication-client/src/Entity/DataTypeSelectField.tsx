import React, { useRef, useEffect } from "react";
import { useFormikContext } from "formik";
import { DATA_TYPE_TO_LABEL_AND_ICON, SYSTEM_DATA_TYPES } from "./constants";
import { getSchemaForDataType } from "@amplication/code-gen-types";
import * as models from "../models";
import { SelectField, SelectFieldProps } from "@amplication/ui/design-system";

export const DATA_TYPE_OPTIONS = Object.entries(DATA_TYPE_TO_LABEL_AND_ICON)
  .filter(
    ([value, content]) => !SYSTEM_DATA_TYPES.has(value as models.EnumDataType)
  )
  .map(([value, content]) => ({
    value,
    label: content.label,
    icon: content.icon,
  }));

type Props = Omit<SelectFieldProps, "options" | "name">;

const DataTypeSelectField = (props: Props) => {
  const formik = useFormikContext<{
    dataType: models.EnumDataType;
    id: models.EnumDataType;
  }>();
  const previousDataTypeValue = useRef<models.EnumDataType>();
  const previousFieldId = useRef<string>();

  //Reset the properties list and the properties default values when data type is changed
  /**@todo: keep values of previous data type when properties are equal */
  /**@todo: keep values of previous data type to be restored if the previous data type is re-selected */
  useEffect(() => {
    const nextDataTypeValue = formik.values.dataType;
    const nextFieldId = formik.values.id;

    //only reset to default if the field ID did not change, and the Data Type was changed
    if (
      previousDataTypeValue.current &&
      previousDataTypeValue.current !== nextDataTypeValue &&
      previousFieldId.current === nextFieldId
    ) {
      const schema = getSchemaForDataType(formik.values.dataType);
      const defaultValues = Object.fromEntries(
        Object.entries(schema.properties).map(([name, property]) => [
          name,
          (property as any).default, // TODO: refactor for type safety with JSON Schema
        ])
      );

      formik.setFieldValue("properties", defaultValues);
    }
    previousFieldId.current = nextFieldId;
    previousDataTypeValue.current = nextDataTypeValue;
  }, [formik]);

  return <SelectField {...props} name="dataType" options={DATA_TYPE_OPTIONS} />;
};

export default DataTypeSelectField;
