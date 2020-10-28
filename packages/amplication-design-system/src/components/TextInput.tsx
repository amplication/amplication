import React, {useState} from "react";
import classNames from "classnames";
import CircleIcon, { EnumCircleIconStyle } from "./CircleIcon";
import { Button } from "./Button";
import "./TextInput.scss";

export type Props = React.HTMLProps<HTMLTextAreaElement | HTMLInputElement> & {
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
  className,
  trailingButton,
  label,
  hideLabel,
  helpText,
  inputRef,
  hasError,
  textarea,
  ...rest
}: Props) {
  const [inputValue, setInputValue] = useState();
  return (
    <div
      className={classNames(`${CLASS_NAME}`, className, {
        [`${CLASS_NAME}--with-trailing-button`]: trailingButton,
        [`${CLASS_NAME}--has-error`]: hasError,
      })}
    >
      <div className={`${CLASS_NAME}__inner-wrapper`}>
        <label>
          {!hideLabel && <span>{label}</span>}
          {textarea ? (
            <textarea
              {...rest}
              // @ts-ignore
              ref={inputRef}
            />
          ) : (
            <input
              {...rest}
              // @ts-ignore
              ref={inputRef}
              value={inputValue!==undefined? inputValue: rest.value}
              onChange={e=>setInputValue(e.target.value)}
            />
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
      {hasError && <div className={`${CLASS_NAME}__error`}>{helpText}</div>}
    </div>
  );
}
