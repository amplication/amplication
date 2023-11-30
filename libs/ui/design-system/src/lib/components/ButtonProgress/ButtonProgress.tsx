import React from "react";

import { Icon, IconSize } from "../Icon/Icon";
import { ButtonGroup as PrimerButtonGroup } from "@primer/react";

import "./ButtonProgress.scss";
import { Button, EnumButtonStyle } from "../..";
import type { Props as ButtonProps } from "../Button/Button";
import classNames from "classnames";

export interface Props extends ButtonProps {
  /** Progress percentage 0-100 */
  progress: number;
  color?: string;
  yellowColorThreshold: number;
  redColorThreshold: number;
  rest?: any;
}

enum EnumButtonProgressStyle {
  Default = "default",
  Warning = "warning",
  Danger = "danger",
}

export const ButtonProgress = (props: Props) => {
  const {
    yellowColorThreshold,
    redColorThreshold,
    progress,
    splitValue,
    className,
    children,
    rest,
  } = props;

  let buttonProgressStyle: EnumButtonProgressStyle;
  if (progress <= redColorThreshold) {
    buttonProgressStyle = EnumButtonProgressStyle.Danger;
  } else if (progress <= yellowColorThreshold) {
    buttonProgressStyle = EnumButtonProgressStyle.Warning;
  } else {
    buttonProgressStyle = EnumButtonProgressStyle.Default;
  }

  return (
    <PrimerButtonGroup
      className={classNames(
        "amp-button-progress",
        `amp-button-progress--${buttonProgressStyle}`
      )}
    >
      <Button
        className={classNames(
          "amp-button-progress",
          `amp-button-progress--left`,
          className,
          `amp-button-progress--${buttonProgressStyle}--left`
        )}
        buttonStyle={EnumButtonStyle.Outline}
        {...rest}
      >
        {splitValue}
      </Button>
      <Button
        className={classNames(
          "amp-button-progress",
          "amp-button-progress--right",
          className,
          `amp-button-progress--${buttonProgressStyle}--right`
        )}
        {...rest}
      >
        {children}
      </Button>
    </PrimerButtonGroup>
  );
};

// return (
//   <Button
//     {...props}
//     isSplit={true}
//     buttonStyle={EnumButtonStyle.Outline}
//     splitValue={children?.toString()}
//     className={classNames(
//       "amp-button",
//       className,
//       "amp-button-progress--split"
//     )}
//   >
//     {leftValue}
//   </Button>
// );
// };
