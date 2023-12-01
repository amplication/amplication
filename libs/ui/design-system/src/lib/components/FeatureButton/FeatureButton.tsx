import React from "react";
import { Button as PrimerButton } from "@primer/react/deprecated";
import type { ButtonProps as PrimerButtonProps } from "@primer/react/deprecated";

import classNames from "classnames";
import { Icon, IconSize } from "../Icon/Icon";
import { isEmpty } from "lodash";

import "./FeatureButton.scss";

export enum EnumButtonStyle {
  Primary = "primary",
  Outline = "outline",
  Text = "text",
}

export enum EnumButtonState {
  Default = "default",
  Danger = "danger",
}

export enum EnumIconPosition {
  Left = "left",
  Right = "right",
}
export interface FeatureButtonProps extends PrimerButtonProps {
  currentUsage?: number;
  usageLimit?: number;
  /** The display style of the button */
  buttonStyle?: EnumButtonStyle;
  icon?: string;
  iconSize?: IconSize;
  iconStyle?: string;
  /** Icon can have left or right position. Default position is right */
  iconPosition?: EnumIconPosition;
  to?: string;
  buttonState?: EnumButtonState;
}

export const FeatureButton = ({
  currentUsage,
  usageLimit,
  buttonStyle = EnumButtonStyle.Primary,
  className,
  children,
  icon,
  iconSize,
  iconStyle,
  iconPosition = EnumIconPosition.Right,
  buttonState = EnumButtonState.Default,
  ...rest
}: FeatureButtonProps) => {
  const hasIcon = !isEmpty(icon);

  return (
    <PrimerButton
      className={classNames(
        "amp-button",
        className,
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
    </PrimerButton>
  );
};
