import React from "react";
import { ColorResult, TwitterPicker } from "react-color";
import { Button, EnumButtonStyle } from "../Button/Button";
import { Label } from "../Label/Label";
import { Popover } from "../Popover/Popover";
import { LABEL_CLASS } from "../constants";
import "./ColorPicker.scss";
import { useTagColorStyle } from "./useTagColorStyle";

const CLASS_NAME = "amp-color-picker";

export type Props = {
  selectedColor: string;
  onChange: (color: string) => void;
  label?: string;
};

export const ColorPicker: React.FC<Props> = ({
  selectedColor,
  onChange,
  label,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleChange = (color: ColorResult) => {
    onChange(color.hex);
  };

  const { style } = useTagColorStyle(selectedColor);

  const colors = [
    "#f5b82e",
    "#acd371",
    "#8dd9b9",
    "#20a4f3",
    "#fb83c3",
    "#f6aa50",
    "#ff6e6e",
    "#ff65a0",
    "#e570d4",
    "#a787ff",
  ];

  return (
    <div className={CLASS_NAME}>
      <Popover
        arrow
        open={isOpen}
        placement="bottom-start"
        content={
          <div className={`${CLASS_NAME}__picker`}>
            <TwitterPicker
              colors={colors}
              color={selectedColor}
              styles={{
                default: {
                  body: {},
                  card: {
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--gray-80)",
                  },
                },
              }}
              triangle="hide"
              onChange={handleChange}
            />
          </div>
        }
      >
        <label className={LABEL_CLASS}>
          {label && <Label text={label} />}
          <Button
            className={`${CLASS_NAME}__button`}
            buttonStyle={EnumButtonStyle.Outline}
            style={style}
            onClick={() => setIsOpen(!isOpen)}
          >
            Choose
          </Button>
        </label>
      </Popover>
    </div>
  );
};
