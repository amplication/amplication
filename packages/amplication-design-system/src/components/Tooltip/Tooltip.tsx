import React from "react";
import classNames from "classnames";
import "./Tooltip.scss";
import { Tooltip as TooltipPopover, TooltipProps } from "@primer/react";

const CLASS_NAME = "amp-tooltip";

export type Props = TooltipProps;

export function Tooltip({ className, children, ...rest }: Props) {
  return (
    <TooltipPopover {...rest} className={classNames(CLASS_NAME, className)}>
      {children}
    </TooltipPopover>
  );
}
