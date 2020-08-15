import React from "react";
import {
  Button as PrimerButton,
  ButtonProps as PrimerButtonProps,
} from "@primer/components";
import classNames from "classnames";
import { Icon } from "@rmwc/icon";

import "./Button.scss";

export enum EnumButtonStyle {
  Primary = "Primary",
  Secondary = "Secondary",
  Clear = "Clear",
}

type ButtonProps = {
  /**The display style of the button */
  buttonStyle?: EnumButtonStyle;
  /**Whether to show an expand icon in the button. Ignored when buttonStyle is "Clear" */
  isSplit?: boolean;
};

export type Props = PrimerButtonProps & ButtonProps;

export const Button = ({
  buttonStyle = EnumButtonStyle.Primary,
  className,
  isSplit,
  children,
  ...rest
}: Props) => {
  if (buttonStyle === EnumButtonStyle.Clear) {
    isSplit = false;
  }
  return (
    <PrimerButton
      className={classNames(
        "amp-button",
        className,
        {
          "amp-button--split": isSplit,
        },
        `amp-button--${buttonStyle.toLowerCase()}`
      )}
      {...rest}
    >
      {children}
      {isSplit && <Icon icon="expand_more" className="icon-split" />}
    </PrimerButton>
  );
};
