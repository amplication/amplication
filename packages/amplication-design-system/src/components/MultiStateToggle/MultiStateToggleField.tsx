import React, { useCallback } from "react";
import { useField } from "formik";
import {
  MultiStateToggle,
  Props as MultiStateToggleProps,
} from "./MultiStateToggle";

export type Props = Omit<MultiStateToggleProps, "onChange" | "selectedValue">;

export const MultiStateToggleField = (props: Props) => {
  const [, meta, helpers] = useField(props.name);

  const { value } = meta;
  const { setValue } = helpers;

  const handleOnChange = useCallback(
    (option) => {
      setValue(option);
    },
    [setValue]
  );

  return (
    <MultiStateToggle
      {...props}
      onChange={handleOnChange}
      selectedValue={value}
    />
  );
};
