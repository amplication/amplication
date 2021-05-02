import React, { useCallback } from "react";
import { PopoverProps, Popover } from "@amplication/design-system";
import { Button, EnumButtonStyle } from "./Button";
import "./HelpPopover.scss";
import { Icon } from "@rmwc/icon";

const CLASS_NAME = "amp-help-popover";

type HelpPopoverProps = PopoverProps & {
  onDismiss: () => void;
};

export const HelpPopover = ({
  children,
  content,
  onDismiss,
  ...rest
}: HelpPopoverProps) => {
  const handleDismiss = useCallback(() => {
    onDismiss && onDismiss();
  }, [onDismiss]);

  const helpContent = (
    <div>
      <div className={`${CLASS_NAME}__details`}>
        <Icon icon="info_circle" className={`${CLASS_NAME}__details__icon`} />
        <div>{content}</div>
      </div>

      <div className={`${CLASS_NAME}__dismiss`}>
        <Button buttonStyle={EnumButtonStyle.Clear} onClick={handleDismiss}>
          Ok, Thanks
        </Button>
      </div>
    </div>
  );

  return (
    <Popover {...rest} content={helpContent} className={CLASS_NAME}>
      {children}
    </Popover>
  );
};
