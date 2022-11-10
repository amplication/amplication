import { Button, EnumButtonStyle } from "@amplication/design-system";
import React from "react";

type Props = {
  onClick: React.MouseEventHandler<HTMLButtonElement> &
    React.MouseEventHandler<HTMLButtonElement>;
  showLabel: boolean;
};

export default function DeleteButton({ onClick, showLabel }: Props) {
  return (
    <Button
      buttonStyle={showLabel ? EnumButtonStyle.Clear : EnumButtonStyle.Text}
      icon="trash_2"
      onClick={onClick}
    >
      {showLabel && "Delete"}
    </Button>
  );
}
