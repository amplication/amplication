import React from "react";
import { Button } from "@rmwc/button";
import { Tooltip } from "@rmwc/tooltip";
import "./PopoverButton.scss";
import "@rmwc/tooltip/styles";

type Props = {
  buttonLabel: string;
  children: React.ReactNode;
  icon: string;
};

const PopoverButton = ({ buttonLabel, children, icon }: Props) => {
  return (
    <div className="popover-button">
      <Tooltip
        className="popover-button__tooltip"
        activateOn="click"
        align="bottomRight"
        content={children}
      >
        <Button icon={icon} label={buttonLabel} unelevated />
      </Tooltip>
    </div>
  );
};
export default PopoverButton;
