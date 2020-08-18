import React from "react";
import { useField } from "formik";
import classNames from "classnames";

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
  const { label, helpText, trailingButton, hideLabel } = props;

  return (
    <div
      className={classNames("text-field", props.className, {
        "text-field--with-trailing-button": trailingButton,
      })}
    >
      <div className="text-field__inner-wrapper">
        <label>
          {!hideLabel && <span>{label}</span>}
          {props.textarea ? (
            <textarea ref={props.inputRef} {...field} {...props} />
          ) : (
            <input ref={props.inputRef} {...field} {...props} />
          )}
        </label>
        {trailingButton && (
          <Button icon={trailingButton.icon}>{trailingButton.title}</Button>
        )}
      </div>
      {meta.error && helpText}
    </div>
  );
};
