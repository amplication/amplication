import React from "react";
import { useField, ErrorMessage } from "formik";
import { TextInput, TextInputProps } from "@amplication/ui/design-system";
import "./NameField.scss";

/** @todo share code with server */
const NAME_REGEX = /^(?![0-9])[a-zA-Z0-9$_]+$/;
const NAME_PATTERN = NAME_REGEX.toString().slice(1, -1);
const HELP_TEXT =
  "Name must only contain letters, numbers, the dollar sign, or the underscore character and must not start with a number";

const CAPITALIZED_NAME_REGEX = /^[A-Z][a-zA-Z0-9$_]+$/;
const CAPITALIZED_NAME_PATTERN = CAPITALIZED_NAME_REGEX.toString().slice(1, -1);
const CAPITALIZED_HELP_TEXT =
  "Name must only contain letters, numbers, the dollar sign, or the underscore character and must start with a capital letter";

const CLASS_NAME = "amp-name-field";

type Props = Omit<TextInputProps, "helpText" | "hasError"> & {
  capitalized?: boolean;
};

const NameField = ({ capitalized, ...rest }: Props) => {
  const [regexp, pattern, helpText] = capitalized
    ? [CAPITALIZED_NAME_REGEX, CAPITALIZED_NAME_PATTERN, CAPITALIZED_HELP_TEXT]
    : [NAME_REGEX, NAME_PATTERN, HELP_TEXT];
  // @ts-ignore
  const [field] = useField<string>({
    ...rest,
    validate: (value) => (value.match(regexp) ? undefined : helpText),
  });

  return (
    <div className={CLASS_NAME}>
      <TextInput
        {...field}
        {...rest}
        label="Name"
        autoComplete="off"
        minLength={1}
        pattern={pattern}
      />
      <ErrorMessage
        name="name"
        component="div"
        className="amplication-label__error"
      />
    </div>
  );
};

export default NameField;
