import React from "react";
import { useField, ErrorMessage } from "formik";
import classNames from "classnames";

import CircleIcon, { EnumCircleIconStyle } from "./CircleIcon";
import { Button } from "./Button";
import "./TextField.scss";

export type Props = (
  | ({
      textarea: true;
      inputRef?: React.Ref<HTMLTextAreaElement>;
    } & React.HTMLProps<HTMLTextAreaElement>)
  | ({
      textarea?: false;
      inputRef?: React.Ref<HTMLInputElement>;
    } & React.HTMLProps<HTMLInputElement>)
) & {
  name: string;
  helpText?: string;
  trailingButton?: {
    title?: string;
    icon?: string;
  };
  hideLabel?: boolean;
};

export const TextField = (props: Props) => {
  const [field, meta] = useField(props);
  const {
    label,
    helpText,
    trailingButton,
    hideLabel,
    inputRef,
    textarea,
    ...rest
  } = props;

  return (
    <div
      className={classNames(
        "text-field",
        props.className,
        {
          "text-field--with-trailing-button": trailingButton,
        },
        { "text-field--has-error": meta.error }
      )}
    >
      <div className="text-field__inner-wrapper">
        <label>
          {!hideLabel && <span>{label}</span>}
          {textarea ? (
            <textarea {...rest} ref={inputRef} {...field} />
          ) : (
            <input {...rest} ref={inputRef} {...field} />
          )}
          {meta.error && (
            <CircleIcon icon="info_i" style={EnumCircleIconStyle.Negative} />
          )}
        </label>
        {trailingButton && (
          <Button type="submit" icon={trailingButton.icon}>
            {trailingButton.title}
          </Button>
        )}
      </div>
      <ErrorMessage
        name={props.name}
        component="div"
        className="text-field__error"
      />
      {meta.error && <div className="text-field__error">{helpText}</div>}
    </div>
  );
};
