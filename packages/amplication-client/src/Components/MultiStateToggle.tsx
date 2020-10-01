import React, { useCallback } from "react";
import classNames from "classnames";
import "@rmwc/chip/styles";
import "./MultiStateToggle.scss";

export type OptionItem = {
  value: string;
  label: string;
};

export type Props = {
  name: string;
  options: OptionItem[];
  label: string;
  selectedValue: string;
  onChange: (selectedValue: string) => void;
};

export const MultiStateToggle = ({
  name,
  options,
  label,
  selectedValue,
  onChange,
}: Props) => {
  const handleClick = useCallback(
    (option) => {
      onChange(option);
    },
    [onChange]
  );

  return (
    <div className="multi-state-toggle">
      <label>{label}</label>
      <div className="multi-state-toggle__states">
        {options.map((option) => (
          <MultiStateToggleItem
            key={option.value}
            item={option}
            onClick={handleClick}
            selected={option.value === selectedValue}
          />
        ))}
      </div>
    </div>
  );
};

type ItemProps = {
  item: OptionItem;
  onClick: (value: string) => void;
  selected: boolean;
};

export const MultiStateToggleItem = ({
  item,
  onClick,
  selected,
}: ItemProps) => {
  const handleClick = useCallback(
    (event) => {
      event.stopPropagation();
      onClick(item.value);
    },
    [onClick, item.value]
  );

  return (
    <div
      className={classNames("multi-state-toggle__states__state", {
        "multi-state-toggle__states__state--selected": selected,
      })}
      onClick={handleClick}
    >
      {item.label}
    </div>
  );
};
