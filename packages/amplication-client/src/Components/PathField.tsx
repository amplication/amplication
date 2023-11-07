import React from "react";
import { useField, ErrorMessage } from "formik";
import { TextInput, TextInputProps } from "@amplication/ui/design-system";
import "./NameField.scss";

const CLASS_NAME = "amp-name-field";

type Props = Omit<TextInputProps, "helpText" | "hasError"> & {
  capitalized?: boolean;
};

const PathField = ({ capitalized, ...rest }: Props) => {
  // @ts-ignore
  const [field] = useField<string>({
    ...rest,
  });

  return (
    <div className={CLASS_NAME}>
      <TextInput
        {...field}
        {...rest}
        label="Path"
        autoComplete="off"
        minLength={1}
      />
      <ErrorMessage
        name="path"
        component="div"
        className="amplication-label__error"
      />
    </div>
  );
};

export default PathField;
