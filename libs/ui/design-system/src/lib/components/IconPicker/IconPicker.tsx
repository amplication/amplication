import React from "react";
import { Button, EnumButtonStyle } from "../Button/Button";
import {
  EnumFlexItemMargin,
  EnumItemsAlign,
  FlexItem,
} from "../FlexItem/FlexItem";
import { Label } from "../Label/Label";
import { Popover } from "../Popover/Popover";
import { LABEL_CLASS } from "../constants";
import "./IconPicker.scss";
import { EnumIconFamily, Icon } from "../Icon/Icon";
import { ICONS } from "./constants";

const CLASS_NAME = "amp-icon-picker";

export type Props = {
  selectedIcon: string;
  onChange: (icon: string) => void;
  label?: string;
  iconOnlyMode?: boolean;
};

export const IconPicker: React.FC<Props> = ({
  selectedIcon,
  onChange,
  label,
  iconOnlyMode,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleChange = (icon: string) => {
    setIsOpen(false);
    onChange(icon);
  };

  return (
    <div className={CLASS_NAME}>
      <Popover
        arrow
        onClose={() => setIsOpen(false)}
        open={isOpen}
        placement="bottom-start"
        content={
          <div className={`${CLASS_NAME}__picker`}>
            <div className={`${CLASS_NAME}__picker__icons`}>
              {ICONS.map((iconName) => (
                <Button
                  buttonStyle={EnumButtonStyle.Text}
                  onClick={() => handleChange(iconName)}
                  key={iconName}
                >
                  <Icon
                    key={iconName}
                    icon={iconName}
                    family={EnumIconFamily.Custom}
                    size="medium"
                  />
                </Button>
              ))}
            </div>

            <FlexItem
              className={`${CLASS_NAME}__footer`}
              itemsAlign={EnumItemsAlign.Center}
              margin={EnumFlexItemMargin.Bottom}
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
              icon="plugin"
            />
          ) : (
            <Button
              className={`${CLASS_NAME}__button`}
              buttonStyle={EnumButtonStyle.Outline}
              onClick={() => setIsOpen(!isOpen)}
              type="button"
            >
              <Icon
                icon={selectedIcon}
                family={EnumIconFamily.Custom}
                size="small"
              />
            </Button>
          )}
        </label>
      </Popover>
    </div>
  );
};
