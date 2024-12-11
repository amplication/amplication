import React, { useCallback, useEffect, useRef } from "react";
import { Button, Props as ButtonProps } from "../Button/Button";
import { Icon } from "../Icon/Icon";
import { Popover } from "../Popover/Popover";
import { Tag } from "../Tag/Tag";
import { EnumTextStyle, Text } from "../Text/Text";
import { OptionItem } from "../types";
import "./SelectPanel.scss";

const CLASS_NAME = "amp-select-panel";

export type Props = {
  label: string;
  options: OptionItem[];
  isMulti?: boolean;
  disabled?: boolean;
  selectedValue: string | string[] | null;
  onChange: (selectedValue: string | string[]) => void;
  buttonProps?: ButtonProps;
};

export const SelectPanel: React.FC<Props> = ({
  label,
  options,
  isMulti,
  disabled,
  selectedValue,
  onChange,
  buttonProps,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const selectRef = useRef<HTMLDivElement | null>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (value: string) => {
    if (!isMulti) {
      setIsOpen(false);
      onChange(value);
    } else {
      selectedValue = selectedValue || [];
      const newSelected = selectedValue.includes(value)
        ? (selectedValue as string[]).filter((item) => item !== value)
        : [...selectedValue, value];
      onChange(newSelected);
    }
  };

  const {
    buttonStyle,
    onClick: buttonOnClick,
    ...otherButtonProps
  } = buttonProps || {};

  const handleButtonClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setIsOpen(!isOpen);
      buttonOnClick && buttonOnClick(e);
    },
    [isOpen, buttonOnClick]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | Event) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={CLASS_NAME} ref={selectRef}>
      <Popover
        arrow
        open={isOpen}
        placement="bottom-start"
        content={
          <div className={`${CLASS_NAME}__picker`} ref={pickerRef}>
            <ul className={`${CLASS_NAME}__picker__items`} role="listbox">
              {options.map((item) => {
                const selected = isMulti
                  ? selectedValue?.includes(item.value)
                  : selectedValue === item.value;
                return (
                  <li
                    className={`${CLASS_NAME}__picker__items__item`}
                    key={item.value}
                    role="option"
                    aria-selected={selected}
                    tabIndex={0}
                    onClick={() => handleChange(item.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleChange(item.value);
                        e.preventDefault(); // Prevent space key from scrolling
                      }
                    }}
                  >
                    {item.color ? (
                      <Tag value={item.label} color={item.color} />
                    ) : (
                      <Text textStyle={EnumTextStyle.Description}>
                        {item.label}
                      </Text>
                    )}
                    {selected && <Icon icon="check" size="xsmall" />}
                  </li>
                );
              })}
            </ul>
          </div>
        }
      >
        <Button
          className={`${CLASS_NAME}__button`}
          buttonStyle={buttonStyle}
          {...otherButtonProps}
          onClick={handleButtonClick}
          type="button"
          disabled={disabled}
        >
          {label}
        </Button>
      </Popover>
    </div>
  );
};
