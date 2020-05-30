import React, { useCallback } from "react";
import { useField } from "formik";
import { Select } from "@rmwc/select";
import "@rmwc/select/styles";

export const SelectField = (props: any) => {
  const [field] = useField(props);
  const handleChange = useCallback(
    (event) => {
      // Formik expects event.target.name which is not set correctly by Material
      // Components Select
      event.target.name = props.name;
      field.onChange(event);
    },
    [props.name, field]
  );
  return <Select {...field} {...props} onChange={handleChange} />;
};
