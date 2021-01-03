import React from "react";
import classNames from "classnames";
import "./Popover.scss";
import { Tooltip, TooltipProps } from "@rmwc/tooltip";
import "@rmwc/tooltip/styles";

const CLASS_NAME = "amp-popover";

export type Props = TooltipProps;

export function Popover({
  children,
  className,
  showArrow = true,
  content,
  ...rest
}: Props) {
  return (
    <Tooltip
      {...rest}
      className={classNames(CLASS_NAME, className)}
      showArrow={showArrow}
      content={<div className={`${CLASS_NAME}__content`}>{content}</div>}
    >
      {children}
    </Tooltip>
  );
}
