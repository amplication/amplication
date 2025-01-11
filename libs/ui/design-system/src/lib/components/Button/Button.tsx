import React from "react";
import { Button as PrimerButton } from "@primer/react/deprecated";
import type { ButtonProps as PrimerButtonProps } from "@primer/react/deprecated";

import classNames from "classnames";
import { Icon, IconSize } from "../Icon/Icon";
import { isEmpty } from "lodash";

import "./Button.scss";

export enum EnumButtonStyle {
  Primary = "primary",
  Outline = "outline",
  Text = "text",
  GradientFull = "gradient-full",
  GradientOutline = "gradient-outline",
}

export enum EnumButtonState {
  Default = "default",
  Danger = "danger",
  Success = "success",
}

export enum EnumIconPosition {
  Left = "left",
  Right = "right",
  None = "none",
}
export interface Props extends PrimerButtonProps {
  /** The display style of the button */
  buttonStyle?: EnumButtonStyle;
  /** Whether to show an expand icon in the button. Ignored when buttonStyle is "Clear" */
  isSplit?: boolean;
  /** When isSplit === true, optional value to show instead of the default expand icon */
  splitValue?: string;
  icon?: string;
  iconSize?: IconSize;
  iconStyle?: string;
  /** Icon can have left or right position. Default position is right */
  iconPosition?: EnumIconPosition;
  to?: string;
  buttonState?: EnumButtonState;
}

export const Button = ({
  buttonStyle = EnumButtonStyle.Primary,
  className,
  isSplit,
  splitValue,
  children,
  icon,
  iconSize,
  iconStyle,
  iconPosition = EnumIconPosition.Right,
  buttonState = EnumButtonState.Default,
  ...rest
}: Props) => {
  const hasIcon = !isEmpty(icon);

  return (
    <PrimerButton
      className={classNames(
        "amp-button",
        className,
        {
          "amp-button--split": isSplit,
        },
        `amp-button--${buttonStyle}`,
        `amp-button--${buttonStyle}--${buttonState}`,
        {
          "amp-button--icon-left":
            iconPosition === EnumIconPosition.Left && hasIcon,
        },
        {
          "amp-button--icon-right":
            iconPosition === EnumIconPosition.Right && hasIcon,
        }
      )}
      {...rest}
    >
      {iconPosition === EnumIconPosition.Right && children}
      {hasIcon && (
        <Icon
          icon={icon as string}
          size={iconSize || "xsmall"}
          className={`amp-button__icon ${iconStyle ? ` ${iconStyle}` : ""}`}
        />
      )}
      {iconPosition === EnumIconPosition.Left && children}
      {isSplit && (
        <span className="amp-button__split">
          {splitValue ? (
            <span className="split-text"> {splitValue}</span>
          ) : (
            <Icon icon="chevron_down" className="split-icon" />
          )}
        </span>
      )}
    </PrimerButton>
  );
};
