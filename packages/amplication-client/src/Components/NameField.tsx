import React, { useRef, useEffect, useState } from "react";
import { useField } from "formik";
import { useDebouncedCallback } from "use-debounce";
import { TextInput, Props as TextInputProps } from "./TextInput";

/** @todo share code with server */
const NAME_REGEX = /^(?![0-9])[a-zA-Z0-9$_]+$/;
const NAME_PATTERN = NAME_REGEX.toString().slice(1, -1);
const HELP_TEXT =
  "Name must only contain letters, numbers, the dollar sign, or the underscore character and must not start with a number";

const CAPITALIZED_NAME_REGEX = /^[A-Z][a-zA-Z0-9$_]+$/;
const CAPITALIZED_NAME_PATTERN = CAPITALIZED_NAME_REGEX.toString().slice(1, -1);
const CAPITALIZED_HELP_TEXT =
  "Name must only contain letters, numbers, the dollar sign, or the underscore character and must start with a capital letter";

const SHOW_MESSAGE_DURATION = 3000;

const CLASS_NAME = "amp-name";

type Props = TextInputProps & {
  capitalized?: boolean;
};

const NameField = ({ capitalized, ...rest }: Props) => {
  // @ts-ignore
  const [field, meta, { setValue }] = useField<string>(props);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const previousNameValue = useRef<string>(field.value);

  const [debouncedHideMessage] = useDebouncedCallback(() => {
    setShowMessage(false);
  }, SHOW_MESSAGE_DURATION);

  const [regexp, pattern, helpText] = capitalized
    ? [CAPITALIZED_NAME_REGEX, CAPITALIZED_NAME_PATTERN, CAPITALIZED_HELP_TEXT]
    : [NAME_REGEX, NAME_PATTERN, HELP_TEXT];

  useEffect(() => {
    const nextNameValue = field.value;
    if (previousNameValue.current !== nextNameValue && nextNameValue !== "") {
      const isMatching = regexp.test(nextNameValue);

      setShowMessage(!isMatching);
      if (isMatching) {
        previousNameValue.current = nextNameValue;
      } else {
        setValue(previousNameValue.current);
        debouncedHideMessage();
      }
    }
  }, [setShowMessage, setValue, debouncedHideMessage, regexp]);

  return (
    <div className={`${CLASS_NAME}-field`}>
      <TextInput
        {...rest}
        label="Name"
        autoComplete="off"
        minLength={1}
        pattern={pattern}
        helpText={helpText}
        hasError={Boolean(meta.error)}
      />
      {showMessage && (
        <div className={`${CLASS_NAME}-field__tooltip`}>{helpText}</div>
      )}
    </div>
  );
};

export default NameField;
