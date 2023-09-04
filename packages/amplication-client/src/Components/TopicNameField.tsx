import React from "react";
import { useField, ErrorMessage } from "formik";
import { TextInput, TextInputProps } from "@amplication/ui/design-system";
import "./NameField.scss";

const TOPIC_REGEX = /^[a-zA-Z0-9._-]+$/;
const TOPIC_PATTERN = TOPIC_REGEX.toString().slice(1, -1);
const HELP_TEXT =
  "Name must only contain letters, numbers, dash, underscore or dot.";

const CLASS_NAME = "amp-name-field";

type Props = Omit<TextInputProps, "helpText" | "hasError"> & {
  name: string;
};

const TopicNameField = ({ name, ...rest }: Props) => {
  const [field] = useField<string>({
    name,
    validate: (value) => (TOPIC_REGEX.test(value) ? undefined : HELP_TEXT),
  });

  return (
    <div className={CLASS_NAME}>
      <TextInput
        {...field}
        {...rest}
        autoComplete="off"
        minLength={1}
        pattern={TOPIC_PATTERN}
      />
      <ErrorMessage
        name="name"
        component="div"
        className="amplication-label__error"
      />
    </div>
  );
};

export default TopicNameField;
