import React from "react";
import classNames from "classnames";
import "./Tooltip.scss";
import MuiTooltip, { TooltipProps } from "@mui/material/Tooltip";

const CLASS_NAME = "amp-tooltip";

type PropsBase = {
  wrap?: boolean;
  className?: string;
  children: React.ReactNode;
  direction?: "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";
  enterDelay?: number;
  noDelay?: boolean;
  style?: React.CSSProperties;
};

type PropsWithTitle = PropsBase & {
  title: React.ReactNode;
};

type PropsWithAriaLabel = PropsBase & {
  "aria-label": React.ReactNode;
};

export type Props = PropsWithTitle | PropsWithAriaLabel;

const DIRECTION_TO_PLACEMENT: Record<string, TooltipProps["placement"]> = {
  n: "top",
  ne: "top-end",
  e: "right",
  se: "bottom-end",
  s: "bottom",
  sw: "bottom-start",
  w: "left",
  nw: "top-start",
};

export function Tooltip({
  className,
  direction,
  children,
  enterDelay = 100,
  noDelay,
  style,
  ...titleOrLabel
}: Props) {
  const placement = DIRECTION_TO_PLACEMENT[direction || "n"];

  let title;

  if ("title" in titleOrLabel) {
    title = titleOrLabel.title;
  } else {
    title = titleOrLabel["aria-label"];
  }

  if (noDelay) {
    enterDelay = 100;
  }

  return (
    <MuiTooltip
      classes={{ popper: classNames(CLASS_NAME, className) }}
      title={title}
      placement={placement}
      style={style}
      arrow
    >
      <div>{children}</div>
    </MuiTooltip>
  );
}
