import React, { useCallback } from "react";
import { Chip, ChipSet } from "@rmwc/chip";
import "@rmwc/chip/styles";
import "./MultiStateToggle.scss";

export type optionItem = {
  value: string;
  label: string;
};

export type Props = {
  name: string;
  options: optionItem[];
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
      <ChipSet>
        {options.map((option) => (
          <MultiStateToggleItem
            key={option.value}
            item={option}
            onClick={handleClick}
            selected={option.value === selectedValue}
          />
        ))}
      </ChipSet>
    </div>
  );
};

type ItemProps = {
  item: optionItem;
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
      onClick(item.value);
    },
    [onClick, item.value]
  );

  return (
    <Chip label={item.label} selected={selected} onInteraction={handleClick} />
  );
};
