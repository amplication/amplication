import React, { useRef, useEffect } from "react";
import { useFormikContext } from "formik";
import { capitalCase } from "capital-case";
import { TextField, Props } from "./TextField";

export const DisplayNameField = (props: Props) => {
  const formik = useFormikContext<{ name: string }>();
  const previousNameValue = useRef<string>();

  useEffect(() => {
    const nextNameValue = formik.values.name;
    if (previousNameValue.current !== nextNameValue) {
      const displayName = generateDisplayName(nextNameValue);
      formik.setFieldValue(props.name, displayName);
    }
    previousNameValue.current = nextNameValue;
  }, [formik, props.name]);

  return <TextField autoComplete="off" {...props} />;
};

export function generateDisplayName(name: string): string {
  return capitalCase(name);
}
