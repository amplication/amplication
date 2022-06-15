import React, { useCallback } from "react";
import * as designSystem from "@amplication/design-system";
import "./ColorSelectButton.scss";

export type Props = {
  color: {
    label: string;
    value: string;
  };
  onColorSelected: (value: string) => void;
};

export const ColorSelectButton = ({ color, onColorSelected }: Props) => {
  const handleClick = useCallback(
    (event) => {
      if (onColorSelected) {
        onColorSelected(color.value);
      }
    },
    [onColorSelected, color]
  );

  return (
    <designSystem.Tooltip
      aria-label={color.label}
      className="color-select-button"
      noDelay
    >
      <designSystem.Button
        type="button"
        onClick={handleClick}
        buttonStyle={designSystem.EnumButtonStyle.Text}
        style={
          color && {
            backgroundColor: `${color.value}`,
          }
        }
      />
    </designSystem.Tooltip>
  );
};
