import React, { useRef, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import { TextField, Props } from "./TextField";
import { useDebouncedCallback } from "use-debounce";

/** @todo share code with server */
const NAME_FIELD = "name";
const NAME_REGEX = /^(?![0-9])[a-zA-Z0-9$_]+$/;
const NAME_PATTERN = NAME_REGEX.toString().slice(1, -1);
const HELP_TEXT =
  "Name must only contain letters, numbers, the dollar sign, or the underscore character and must not start with a number";
const SHOW_MESSAGE_DURATION = 3000;

const NameField = (props: Props) => {
  if (props.name !== NAME_FIELD) {
    /**@todo: add support for dynamic field name */
    throw new Error("NameField must be used with props.name==='name' ");
  }

  const [showMessage, setShowMessage] = useState<boolean>(false);

  const formik = useFormikContext<{
    name: string;
  }>();
  const previousNameValue = useRef<string>();

  const [debouncedHideMessage] = useDebouncedCallback(() => {
    setShowMessage(false);
  }, SHOW_MESSAGE_DURATION);

  useEffect(() => {
    const nextNameValue = formik.values.name;
    if (previousNameValue.current !== nextNameValue && nextNameValue !== "") {
      const regexp = new RegExp(NAME_PATTERN);
      const isMatching = regexp.test(nextNameValue);

      setShowMessage(!isMatching);
      if (isMatching) {
        previousNameValue.current = nextNameValue;
      } else {
        formik.setFieldValue(props.name, previousNameValue.current);
        debouncedHideMessage();
      }
    }
  }, [formik, props.name, debouncedHideMessage]);

  return (
    <div className="amp-name-field">
      <TextField
        {...props}
        label="Name"
        autoComplete="off"
        minLength={1}
        pattern={NAME_PATTERN}
        helpText={HELP_TEXT}
      />
      {showMessage && (
        <div className="amp-name-field__tooltip">{HELP_TEXT}</div>
      )}
    </div>
  );
};

export default NameField;
