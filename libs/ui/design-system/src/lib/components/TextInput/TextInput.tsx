import React from "react";
import classNames from "classnames";
import { Icon } from "../Icon/Icon";
import "./TextInput.scss";
import { Label, LabelTypes } from "../Label/Label";
import { Props as InputToolTipProps } from "../InputTooltip/InputTooltip";
import { EnumTextColor, EnumTextStyle, Text } from "../Text/Text";

export type Props = React.HTMLProps<HTMLTextAreaElement | HTMLInputElement> & {
  helpText?: string;

  inputRef?: React.Ref<HTMLInputElement> | React.Ref<HTMLTextAreaElement>;
  hideLabel?: boolean;
  hasError?: boolean;
  textarea?: boolean;
  textareaSize?: "small" | "large";
  labelType?: LabelTypes;
  inputToolTip?: InputToolTipProps | undefined;
};

const CLASS_NAME = "text-input";

export function TextInput({
  className,
  label,
  hideLabel,
  helpText,
  inputRef,
  hasError,
  textarea,
  labelType,
  inputToolTip,
  textareaSize = "large",
  ...rest
}: Props) {
  const key = rest.key || rest.autoFocus?.toString();
  return (
    <div
      className={classNames(`${CLASS_NAME}`, className, {
        [`${CLASS_NAME}--has-error`]: hasError,
        [`${CLASS_NAME}--textarea`]: textarea,
      })}
    >
      <div className={`${CLASS_NAME}__inner-wrapper`}>
        <label className="input-label">
          {!hideLabel && label && (
            <Label text={label} inputToolTip={inputToolTip} />
          )}

          {textarea ? (
            <textarea
              {...rest}
              ref={inputRef as React.Ref<HTMLTextAreaElement>}
              className={`${CLASS_NAME}__textarea--${textareaSize}`}
            />
          ) : (
            <input
              key={key}
              {...rest}
              ref={inputRef as React.Ref<HTMLInputElement>}
            />
          )}

          {helpText && labelType && labelType === "normal" && (
            <Label text={helpText} type={labelType} />
          )}
        </label>
      </div>

      {hasError && helpText && (
        <Text
          textStyle={EnumTextStyle.Description}
          textColor={EnumTextColor.error}
        >
          {helpText}
        </Text>
      )}
    </div>
  );
}
