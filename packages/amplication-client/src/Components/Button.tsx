import React from "react";
import {
  Button as PrimerButton,
  ButtonProps as PrimerButtonProps,
} from "@primer/components";
import classNames from "classnames";
import { Icon } from "@rmwc/icon";

import "./Button.scss";

export enum EnumButtonStyle {
  Primary = "primary",
  Secondary = "secondary",
}

type ButtonProps = {
  buttonStyle?: EnumButtonStyle;
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
  return (
    <PrimerButton
      className={classNames(
        "amp-button",
        className,
        {
          "amp-button--split": isSplit,
        },
        `amp-button--${buttonStyle}`
      )}
      {...rest}
    >
      {children}
      {isSplit && <Icon icon="expand_more" className="icon-split" />}
    </PrimerButton>
  );
};
