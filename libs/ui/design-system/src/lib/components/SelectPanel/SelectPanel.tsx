import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Button,
  Props as ButtonProps,
  EnumButtonStyle,
  EnumIconPosition,
} from "../Button/Button";
import { Icon } from "../Icon/Icon";
import { Popover } from "../Popover/Popover";
import { Tag } from "../Tag/Tag";
import { EnumTextColor, EnumTextStyle, Text } from "../Text/Text";
import { OptionItem } from "../types";
import {
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  FlexItem,
} from "../FlexItem/FlexItem";
import "./SelectPanel.scss";
import { Label } from "../Label/Label";
import classNames from "classnames";
import { Props as InputToolTipProps } from "../InputTooltip/InputTooltip";

const CLASS_NAME = "amp-select-panel";
const DEFAULT_COLOR = "#FFFFFF";

export type Props = {
  label: string;
  options: OptionItem[];
  isMulti?: boolean;
  disabled?: boolean;
  selectedValue: string | string[] | null;
  onChange: (selectedValue: string | string[] | null) => void;
  buttonProps?: ButtonProps;
  openButtonProps?: Omit<ButtonProps, "onClick">;
  showSelectedItemsInButton?: boolean;
  emptyItemLabel?: string;
  showEmptyItem?: boolean;
  initialOpen?: boolean;
  showLabelWhenSelected?: boolean;
  showAsSelectField?: boolean;
  inputToolTip?: InputToolTipProps | undefined;
  isClearable?: boolean;
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
  emptyItemLabel = "All",
  showEmptyItem = false,
  initialOpen = false,
  showLabelWhenSelected = false,
  showAsSelectField = false,
  inputToolTip,
  isClearable = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(initialOpen && !disabled);

  const selectRef = useRef<HTMLDivElement | null>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const selectedItems = useMemo(() => {
    if (!selectedValue) {
      if (showEmptyItem) {
        return [{ value: null, label: emptyItemLabel }];
      }
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
  }, [selectedValue, options, isMulti, showEmptyItem, emptyItemLabel]);

  const handleClear = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    onChange(null);
  };

  const handleChange = (value: string | null) => {
    if (!isMulti) {
      setIsOpen(false);
      onChange(value);
    } else {
      if (value === null) {
        onChange(null);
      } else {
        selectedValue = selectedValue || [];
        const newSelected = selectedValue.includes(value)
          ? (selectedValue as string[]).filter((item) => item !== value)
          : [...selectedValue, value];
        onChange(newSelected);
      }
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

  const optionsWithEmptyItem =
    showEmptyItem && !isMulti
      ? [{ value: "", label: emptyItemLabel }, ...options]
      : options;

  return (
    <div
      className={classNames(CLASS_NAME, {
        [`${CLASS_NAME}--as-select-field`]: showAsSelectField,
      })}
      ref={selectRef}
    >
      <Popover
        arrow
        open={isOpen}
        placement="bottom-start"
        content={
          <div className={`${CLASS_NAME}__picker`} ref={pickerRef}>
            <ul className={`${CLASS_NAME}__picker__items`} role="listbox">
              {optionsWithEmptyItem?.map((item) => {
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
                    <SelectPanelItemContent
                      item={item}
                      textMode={true}
                      includeDescription={true}
                      isMulti={isMulti}
                    />
                    {selected && <Icon icon="check" size="xsmall" />}
                  </li>
                );
              })}
              {optionsWithEmptyItem?.length === 0 && (
                <li className={`${CLASS_NAME}__picker__items__item`}>
                  <Text
                    textStyle={EnumTextStyle.Description}
                    textColor={EnumTextColor.Black20}
                  >
                    No items
                  </Text>
                </li>
              )}
            </ul>
          </div>
        }
      >
        {showAsSelectField ? (
          <label className="input-label">
            {label && <Label text={label} inputToolTip={inputToolTip} />}
            <div className={`${CLASS_NAME}__button__wrapper-as-textbox`}>
              <SelectPanelButton
                isClearable={isClearable}
                onClear={handleClear}
                label={null}
                selectedItems={selectedItems}
                showLabelWhenSelected={showLabelWhenSelected}
                showSelectedItemsInButton={showSelectedItemsInButton}
                isMulti={isMulti}
                buttonStyle={EnumButtonStyle.Text}
                otherButtonProps={{
                  icon: "chevron_down",
                  iconPosition: EnumIconPosition.Right,
                }}
                openButtonProps={{
                  icon: "chevron_up",
                  iconPosition: EnumIconPosition.Right,
                }}
                handleButtonClick={handleButtonClick}
                disabled={disabled}
                isOpen={isOpen}
                showAsSelectField={showAsSelectField}
              />
            </div>
          </label>
        ) : (
          <SelectPanelButton
            isClearable={isClearable}
            onClear={handleClear}
            label={label}
            selectedItems={selectedItems}
            showLabelWhenSelected={showLabelWhenSelected}
            showSelectedItemsInButton={showSelectedItemsInButton}
            isMulti={isMulti}
            buttonStyle={buttonStyle}
            otherButtonProps={otherButtonProps}
            openButtonProps={openButtonProps}
            handleButtonClick={handleButtonClick}
            disabled={disabled}
            isOpen={isOpen}
            showAsSelectField={showAsSelectField}
          />
        )}
      </Popover>
    </div>
  );
};

type SelectPanelButtonProps = {
  label: string | null;
  selectedItems: OptionItem[];
  showLabelWhenSelected: boolean;
  showSelectedItemsInButton: boolean;
  isMulti?: boolean;
  buttonStyle?: EnumButtonStyle;
  otherButtonProps?: ButtonProps;
  openButtonProps?: ButtonProps;
  handleButtonClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  disabled?: boolean;
  isOpen?: boolean;
  showAsSelectField?: boolean;
  isClearable?: boolean;
  onClear?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const SelectPanelButton = ({
  label,
  selectedItems,
  showLabelWhenSelected,
  showSelectedItemsInButton,
  isMulti,
  buttonStyle,
  otherButtonProps,
  openButtonProps,
  handleButtonClick,
  disabled,
  isOpen,
  showAsSelectField,
  isClearable,
  onClear,
}: SelectPanelButtonProps) => {
  return (
    <FlexItem
      direction={EnumFlexDirection.Row}
      gap={EnumGapSize.Small}
      itemsAlign={EnumItemsAlign.Center}
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
        {label && (showLabelWhenSelected || selectedItems.length === 0) && (
          <span className={`${CLASS_NAME}__button__label`}>{label}</span>
        )}
        {selectedItems.length > 0 && showSelectedItemsInButton && (
          <>
            {selectedItems.slice(0, 2).map((item) => (
              <SelectPanelItemContent
                key={item.value}
                item={item}
                isMulti={isMulti}
                includeDescription={false}
                textMode={false}
              />
            ))}
            {selectedItems.length > 2 && (
              <Tag
                value={`+${selectedItems.length - 2}`}
                color={DEFAULT_COLOR}
                textMode={false}
              />
            )}
          </>
        )}
      </Button>
      {isClearable && selectedItems.length > 0 && !disabled && (
        <Button
          icon="close"
          iconSize="small"
          buttonStyle={EnumButtonStyle.Text}
          className={`${CLASS_NAME}__button__clear`}
          onClick={onClear}
        />
      )}
    </FlexItem>
  );
};

type SelectPanelItemContentProps = {
  item: OptionItem;
  isMulti?: boolean;
  includeDescription?: boolean;
  textMode?: boolean;
};

const SelectPanelItemContent = ({
  item,
  isMulti,
  includeDescription = true,
  textMode = false,
}: SelectPanelItemContentProps) => {
  const content =
    item.color || isMulti ? (
      <Tag
        value={item.label}
        color={item.color || DEFAULT_COLOR}
        textMode={textMode}
      />
    ) : (
      <Text textStyle={EnumTextStyle.Description}>{item.label}</Text>
    );

  return !includeDescription ? (
    content
  ) : (
    <FlexItem direction={EnumFlexDirection.Column} gap={EnumGapSize.Small}>
      {content}
      {item.description && (
        <Text
          textStyle={EnumTextStyle.Description}
          className={`${CLASS_NAME}__item__description`}
        >
          {item.description}
        </Text>
      )}
    </FlexItem>
  );
};
