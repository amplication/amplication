import React from "react";
import classNames from "classnames";
import { Icon } from "../Icon/Icon";
import { Button } from "../Button/Button";
import "./TextInput.scss";
import { Label, LabelTypes } from "../Label/Label";

export type Props = React.HTMLProps<HTMLTextAreaElement | HTMLInputElement> & {
  helpText?: string;
  trailingButton?: {
    title?: string;
    icon?: string;
  };
  inputRef?: React.Ref<HTMLInputElement> | React.Ref<HTMLTextAreaElement>;
  hideLabel?: boolean;
  hasError?: boolean;
  textarea?: boolean;
  labelType?: LabelTypes;
};

const CLASS_NAME = "text-input";

export function TextInput({
  className,
  trailingButton,
  label,
  hideLabel,
  helpText,
  inputRef,
  hasError,
  textarea,
  labelType,
  ...rest
}: Props) {
  return (
    <div
      className={classNames(`${CLASS_NAME}`, className, {
        [`${CLASS_NAME}--with-trailing-button`]: trailingButton,
        [`${CLASS_NAME}--has-error`]: hasError,
      })}
    >
      <div className={`${CLASS_NAME}__inner-wrapper`}>
        <label className="input-label">
          {!hideLabel && label && <Label text={label} />}
          {textarea ? (
            <textarea
              {...rest}
              ref={inputRef as React.Ref<HTMLTextAreaElement>}
            />
          ) : (
            <input {...rest} ref={inputRef as React.Ref<HTMLInputElement>} />
          )}
          {hasError && (
            <Icon
              icon="info_circle"
              size="small"
              className={`${CLASS_NAME}__invalid`}
            />
          )}
        </label>
        {trailingButton && (
          <Button type="submit" icon={trailingButton.icon}>
            {trailingButton.title}
          </Button>
        )}
      </div>
      {helpText && labelType && labelType === "normal" && (
        <Label text={helpText} type={labelType} />
      )}
      {hasError && helpText && <Label text={helpText} type="error" />}
    </div>
  );
}
