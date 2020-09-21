import React from "react";
import { ErrorMessage } from "formik";
import classNames from "classnames";

import CircleIcon, { EnumCircleIconStyle } from "./CircleIcon";
import { Button } from "./Button";
import "./TextInput.scss";

export type Props = React.HTMLProps<HTMLTextAreaElement | HTMLInputElement> & {
  name: string;
  helpText?: string;
  trailingButton?: {
    title?: string;
    icon?: string;
  };
  inputRef?: React.Ref<HTMLInputElement | HTMLTextAreaElement | null>;
  hideLabel?: boolean;
  hasError?: boolean;
  textarea?: boolean;
};

const CLASS_NAME = "text-input";

export function TextInput({
  name,
  className,
  trailingButton,
  hasError,
  label,
  hideLabel,
  helpText,
  ...rest
}: Props) {
  return (
    <div
      className={classNames(`${CLASS_NAME}`, className, {
        [`${CLASS_NAME}--with-trailing-button`]: trailingButton,
        [`${CLASS_NAME}--has-error]`]: hasError,
      })}
    >
      <div className={`${CLASS_NAME}__inner-wrapper`}>
        <label>
          {!hideLabel && <span>{label}</span>}
          {rest.textarea ? (
            // @ts-ignore
            <textarea {...rest} ref={rest.inputRef} />
          ) : (
            // @ts-ignore
            <input {...rest} ref={rest.inputRef} />
          )}
          {hasError && (
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
        name={name}
        component="div"
        className={`${CLASS_NAME}__error`}
      />
      {hasError && <div className={`${CLASS_NAME}__error`}>{helpText}</div>}
    </div>
  );
}
