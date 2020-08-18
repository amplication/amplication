import React from "react";
import { useField } from "formik";
import classNames from "classnames";
import { isEmpty } from "lodash";

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
  trailingButtonTitle?: string;
  trailingButtonIcon?: string;
  hideLabel?: boolean;
};

export const TextField = (props: Props) => {
  const [field, meta] = useField(props);
  const {
    label,
    helpText,
    trailingButtonTitle,
    trailingButtonIcon,
    hideLabel,
  } = props;
  const showButton = !isEmpty(trailingButtonTitle);

  return (
    <div
      className={classNames("text-field", props.className, {
        "text-field--with-trailing-button": showButton,
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
        {showButton && (
          <Button icon={trailingButtonIcon}>{trailingButtonTitle}</Button>
        )}
      </div>
      {meta.error && helpText}
    </div>
  );
};
