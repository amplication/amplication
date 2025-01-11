import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Button, Props as ButtonProps } from "../Button/Button";
import { Icon } from "../Icon/Icon";
import { Popover } from "../Popover/Popover";
import { Tag } from "../Tag/Tag";
import { EnumTextStyle, Text } from "../Text/Text";
import { OptionItem } from "../types";
import "./SelectPanel.scss";

const CLASS_NAME = "amp-select-panel";
const DEFAULT_COLOR = "#FFFFFF";

export type Props = {
  label: string;
  options: OptionItem[];
  isMulti?: boolean;
  disabled?: boolean;
  selectedValue: string | string[] | null;
  onChange: (selectedValue: string | string[]) => void;
  buttonProps?: ButtonProps;
  openButtonProps?: Omit<ButtonProps, "onClick">;
  showSelectedItemsInButton?: boolean;
};

export const SelectPanel: React.FC<Props> = ({
  label,
  options,
  isMulti,
  disabled,
  selectedValue,
  onChange,
  buttonProps,
  openButtonProps,
  showSelectedItemsInButton = true,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const selectRef = useRef<HTMLDivElement | null>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const selectedItems = useMemo(() => {
    if (!selectedValue) {
      return [];
    }

    if (isMulti) {
      if (!Array.isArray(selectedValue)) {
        return [];
      }
      return (selectedValue as string[]).map((value) => {
        return (
          options.find((option) => option.value === value) || {
            value,
            label: value,
          }
        );
      });
    } else {
      return options.filter((option) => option.value === selectedValue);
    }
  }, [selectedValue, options, isMulti]);

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
                    <SelectPanelItemContent item={item} />
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
          {...(isOpen ? openButtonProps : {})}
          onClick={handleButtonClick}
          type="button"
          disabled={disabled}
        >
          {selectedItems.length > 0 && showSelectedItemsInButton
            ? selectedItems.map((item) => (
                <SelectPanelItemContent
                  key={item.value}
                  item={item}
                  isMulti={isMulti}
                />
              ))
            : label}
        </Button>
      </Popover>
    </div>
  );
};

type SelectPanelItemContentProps = {
  item: OptionItem;
  isMulti?: boolean;
};

const SelectPanelItemContent = ({
  item,
  isMulti,
}: SelectPanelItemContentProps) => {
  return item.color || isMulti ? (
    <Tag value={item.label} color={item.color || DEFAULT_COLOR} />
  ) : (
    <Text textStyle={EnumTextStyle.Description}>{item.label}</Text>
  );
};
