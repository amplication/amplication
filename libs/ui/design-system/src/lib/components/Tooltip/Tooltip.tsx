import React from "react";
import classNames from "classnames";
import "./Tooltip.scss";
import { Tooltip as TooltipPrimer, TooltipProps } from "@primer/react";

const CLASS_NAME = "amp-tooltip";

export type Props = TooltipProps & { show?: boolean };

export function Tooltip({ className, children, show, ...rest }: Props) {
  if (show === false) {
    return <>{children}</>;
  }
  return (
    <TooltipPrimer {...rest} className={classNames(CLASS_NAME, className)}>
      {children}
    </TooltipPrimer>
  );
}
