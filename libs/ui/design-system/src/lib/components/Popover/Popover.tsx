import React from "react";
import classNames from "classnames";

import "./Popover.scss";
import { Tooltip, TooltipProps } from "@mui/material";

const CLASS_NAME = "amp-popover";

export type Props = Omit<TooltipProps, "title"> & {
  content: NonNullable<React.ReactNode>;
};

export function Popover({
  className,
  content,
  children,
  onClose,
  disableHoverListener = true,
  ...props
}: Props) {
  return (
    <Tooltip
      disableHoverListener={disableHoverListener}
      onClose={(event) => {
        //raise the onclose event if it is a keyboard event
        if (event.type === "keydown") {
          onClose?.(event);
        }
      }}
      classes={{
        popper: classNames(`${CLASS_NAME}__popper`, className),
        tooltip: `${CLASS_NAME} ${CLASS_NAME}__content`,
        arrow: `${CLASS_NAME}__arrow`,
      }}
      {...props}
      arrow
      title={<div className={`${CLASS_NAME}__inner-content`}>{content}</div>}
    >
      <PopoverChildren>{children}</PopoverChildren>
    </Tooltip>
  );
}

type PopoverChildrenProps = {
  children: React.ReactNode;
};

const PopoverChildren = React.forwardRef<HTMLDivElement, PopoverChildrenProps>(
  function PopoverChildren({ children, ...props }: PopoverChildrenProps, ref) {
    //  Spread the props to the underlying DOM element.
    return (
      <div {...props} ref={ref}>
        {children}
      </div>
    );
  }
);
