import React, { useCallback } from "react";
import { useField } from "formik";
import { Chip, ChipSet } from "@rmwc/chip";
import "@rmwc/chip/styles";
import "./MultiStateToggle.scss";

type Props = { name: string; options: string[] };

export const MultiStateToggle = ({ name, options }: Props) => {
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
    <ChipSet className="multi-state-toggle">
      {options.map((option) => (
        <MultiStateToggleItem
          value={option}
          onClick={handleClick}
          selected={option === value}
        />
      ))}
    </ChipSet>
  );
};

type ItemProps = {
  value: string;
  onClick: (value: string) => void;
  selected: boolean;
};

export const MultiStateToggleItem = ({
  value,
  onClick,
  selected,
}: ItemProps) => {
  const handleClick = useCallback(
    (event) => {
      onClick(value);
    },
    [onClick, value]
  );

  return <Chip label={value} selected={selected} onInteraction={handleClick} />;
};
