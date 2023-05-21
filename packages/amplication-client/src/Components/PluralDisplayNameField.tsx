import React, { useRef, useEffect } from "react";
import { useFormikContext } from "formik";
import pluralize from "pluralize";
import { TextField, TextFieldProps } from "@amplication/ui/design-system";

export const PluralDisplayNameField = (props: TextFieldProps) => {
  const formik = useFormikContext<{ displayName: string }>();
  const previousNameValue = useRef<string>();

  useEffect(() => {
    const nextDisplayNameValue = formik.values.displayName;
    if (previousNameValue.current !== nextDisplayNameValue) {
      const pluralDisplayName = generatePluralDisplayName(nextDisplayNameValue);
      formik.setFieldValue(props.name, pluralDisplayName);
    }
    previousNameValue.current = nextDisplayNameValue;
  }, [formik, props.name]);

  // @ts-ignore
  return <TextField {...props} />;
};

export function generatePluralDisplayName(displayName: string): string {
  return pluralize(displayName);
}

export function generateSingularDisplayName(displayName: string): string {
  return pluralize.singular(displayName);
}
