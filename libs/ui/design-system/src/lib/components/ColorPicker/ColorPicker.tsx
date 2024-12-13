import React from "react";
import { ColorResult, SketchPicker, TwitterPicker } from "react-color";
import { Button, EnumButtonStyle } from "../Button/Button";
import {
  EnumFlexItemMargin,
  EnumItemsAlign,
  FlexItem,
} from "../FlexItem/FlexItem";
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
  iconOnlyMode?: boolean;
};

export const COLORS = [
  "#f5b82e",
  "#acd371",
  "#8dd9b9",
  "#2EF547",
  "#20a4f3",
  "#fb83c3",
  "#f6aa50",
  "#ff6e6e",
  "#ff65a0",
  "#e570d4",
  "#a787ff",
  "#6e7ff6",
  "#F7E736",
  "#ffffff",
  "#999999",
  "#444444",
];

const SIMPLE_MODE_COLORS = COLORS.slice(0, 10);

export const ColorPicker: React.FC<Props> = ({
  selectedColor,
  onChange,
  label,
  iconOnlyMode,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const [advancedMode, setAdvancedMode] = React.useState(false);

  const handleChange = (color: ColorResult) => {
    onChange(color.hex);
  };

  const { style } = useTagColorStyle(selectedColor);

  return (
    <div className={CLASS_NAME}>
      <Popover
        onClose={() => setIsOpen(false)}
        arrow
        open={isOpen}
        placement="bottom-start"
        content={
          <div className={`${CLASS_NAME}__picker`}>
            {advancedMode ? (
              <SketchPicker
                presetColors={COLORS}
                color={selectedColor}
                styles={{
                  default: {
                    controls: {
                      color: "var(--gray-base)",
                    },
                    picker: {
                      border: "none",
                      background: "none",
                      boxShadow: "none",
                    },
                  },
                }}
                onChange={handleChange}
              />
            ) : (
              <TwitterPicker
                colors={SIMPLE_MODE_COLORS}
                color={selectedColor}
                styles={{
                  default: {
                    body: {
                      padding: "var(--default-spacing)",
                    },
                    card: {
                      border: "none",
                      background: "none",
                      boxShadow: "none",
                    },
                  },
                }}
                triangle="hide"
                onChange={handleChange}
              />
            )}

            <FlexItem
              className={`${CLASS_NAME}__footer`}
              itemsAlign={EnumItemsAlign.Center}
              margin={EnumFlexItemMargin.Bottom}
              start={
                <Button
                  buttonStyle={EnumButtonStyle.Text}
                  onClick={() => setAdvancedMode(!advancedMode)}
                >
                  {advancedMode ? "Less.." : "More..."}
                </Button>
              }
              end={
                <Button
                  buttonStyle={EnumButtonStyle.Text}
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Button>
              }
            ></FlexItem>
          </div>
        }
      >
        <label className={LABEL_CLASS}>
          {label && <Label text={label} />}
          {iconOnlyMode ? (
            <Button
              buttonStyle={EnumButtonStyle.Text}
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              icon="color"
            />
          ) : (
            <Button
              className={`${CLASS_NAME}__button`}
              buttonStyle={EnumButtonStyle.Outline}
              style={style}
              onClick={() => setIsOpen(!isOpen)}
              type="button"
            >
              Choose
            </Button>
          )}
        </label>
      </Popover>
    </div>
  );
};
