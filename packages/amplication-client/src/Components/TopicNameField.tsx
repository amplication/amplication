import { TextInput, TextInputProps } from "@amplication/design-system";
import { useField } from "formik";
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import "./NameField.scss";

const TOPIC_REGEX = /^[a-zA-Z0-9._-]+$/;
const TOPIC_PATTERN = TOPIC_REGEX.toString().slice(1, -1);
const HELP_TEXT =
  "Name must only contain letters, numbers, dash, underscore or dot.";

const SHOW_MESSAGE_DURATION = 3000;

const CLASS_NAME = "amp-name-field";

type Props = Omit<TextInputProps, "helpText" | "hasError"> & {
  name: string;
};

const TopicNameField = ({ name, ...rest }: Props) => {
  const [field, meta] = useField<string>({
    name,
    validate: (value) => (TOPIC_REGEX.test(value) ? undefined : HELP_TEXT),
  });
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const [debouncedHideMessage] = useDebouncedCallback(() => {
    setShowMessage(false);
  }, SHOW_MESSAGE_DURATION);

  useEffect(() => {
    if (meta.error) {
      setShowMessage(true);
    } else {
      debouncedHideMessage();
    }
  }, [meta.error, setShowMessage, debouncedHideMessage]);

  return (
    <div className={CLASS_NAME}>
      <TextInput
        {...field}
        {...rest}
        label={rest.label}
        autoComplete="off"
        minLength={1}
        pattern={TOPIC_PATTERN}
      />
      {showMessage && (
        <div className={`${CLASS_NAME}__tooltip`}>{HELP_TEXT}</div>
      )}
    </div>
  );
};

export default TopicNameField;
