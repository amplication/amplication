import React, { useCallback } from "react";
import { useField } from "formik";
import { Chip, ChipSet } from "@rmwc/chip";
import "@rmwc/chip/styles";
import "./MultiStateToggle.scss";

type optionItem = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  options: optionItem[];
  label: string;
};

export const MultiStateToggle = ({ name, options, label }: Props) => {
  const [, meta, helpers] = useField(name);

  const { value } = meta;
  const { setValue } = helpers;

  const handleClick = useCallback(
    (option) => {
      setValue(option);
    },
    [setValue]
  );

  return (
    <div className="multi-state-toggle">
      <label>{label}</label>
      <ChipSet>
        {options.map((option) => (
          <MultiStateToggleItem
            item={option}
            onClick={handleClick}
            selected={option.value === value}
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
