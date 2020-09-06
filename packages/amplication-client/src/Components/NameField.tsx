import React, { useRef, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import { TextField, Props } from "./TextField";
import { useDebouncedCallback } from "use-debounce";

/** @todo share code with server */
const NAME_REGEX = /^(?![0-9])[a-zA-Z0-9$_]+$/;
const NAME_PATTERN = NAME_REGEX.toString().slice(1, -1);
const HELP_TEXT =
  "Name must only contain letters, numbers, the dollar sign, or the underscore character and must not start with a number";
const SHOW_MESSAGE_DURATION = 3000;

const NameField = (props: Props) => {
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
    if (previousNameValue.current !== nextNameValue) {
      const regexp = new RegExp(NAME_PATTERN);
      const testPass = regexp.test(nextNameValue);

      if (!testPass) {
        formik.setFieldValue(props.name, previousNameValue.current);
        setShowMessage(true);
        debouncedHideMessage();
      } else {
        setShowMessage(false);
        previousNameValue.current = nextNameValue;
      }
    }
  }, [formik, props.name, debouncedHideMessage]);

  return (
    <div className="amp-name-field">
      <TextField
        label="Name"
        autoComplete="off"
        minLength={1}
        {...props}
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
