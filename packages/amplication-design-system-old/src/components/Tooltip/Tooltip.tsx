import React from "react";
import classNames from "classnames";
import "./Tooltip.scss";
import { Tooltip as TooltipPrimer, TooltipProps } from "@primer/react";

const CLASS_NAME = "amp-tooltip";

export type Props = TooltipProps;

export function Tooltip({ className, children, ...rest }: Props) {
  return (
    <TooltipPrimer {...rest} className={classNames(CLASS_NAME, className)}>
      {children}
    </TooltipPrimer>
  );
}
