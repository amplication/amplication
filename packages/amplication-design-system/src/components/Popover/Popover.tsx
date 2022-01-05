import React from "react";
import classNames from "classnames";
import "./Popover.scss";
import { Popover as PrimerPopover, PopoverProps } from "@primer/components";

const CLASS_NAME = "amp-popover";

export type Props = PopoverProps & { content: React.ReactNode };

export function Popover({ className, content, ...rest }: Props) {
  return (
    <PrimerPopover {...rest} className={classNames(CLASS_NAME, className)}>
      <PrimerPopover.Content className={`${CLASS_NAME}__content`}>
        {content}
      </PrimerPopover.Content>
    </PrimerPopover>
  );
}
