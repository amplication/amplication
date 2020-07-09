import React, { useCallback, useContext } from "react";
import { useField } from "formik";
import { SelectMenu } from "@primer/components";
import { Icon } from "@rmwc/icon";
import "@rmwc/icon/styles";

import "./SelectField.scss";

type optionItem = {
  value: string;
  text: string;
};

type Props = {
  label: string;
  name: string;
  options: optionItem[];
};

export const SelectField = ({ name, options, label }: Props) => {
  const [field, meta, helpers] = useField(name);

  const { value } = meta;
  const { setValue } = helpers;

  const handleClick = useCallback(
    (option) => {
      setValue(option);
    },
    [setValue]
  );

  return (
    <SelectMenu className="select-field">
      <SelectFieldTextbox selectedItem={value} label={label} />
      <SelectMenu.Modal className="select-field__model">
        <SelectMenu.List>
          {options.map((option) => (
            <SelectFieldItem
              item={option}
              onClick={handleClick}
              selected={option.value === value}
            />
          ))}
        </SelectMenu.List>
      </SelectMenu.Modal>
    </SelectMenu>
  );
};

type ItemProps = {
  item: optionItem;
  onClick: (value: string) => void;
  selected: boolean;
};

export const SelectFieldItem = ({ item, onClick, selected }: ItemProps) => {
  const handleClick = useCallback(
    (event) => {
      onClick(item.value);
    },
    [onClick, item.value]
  );

  return (
    <SelectMenu.Item
      className="select-field__item"
      selected={selected}
      onClick={handleClick}
    >
      {item.text}
    </SelectMenu.Item>
  );
};

type TextProps = {
  selectedItem: string;
  label: string;
};

export const SelectFieldTextbox = ({ selectedItem, label }: TextProps) => {
  const menuContext = useContext(SelectMenu.MenuContext);

  const handleClick = useCallback(() => {
    menuContext.setOpen(!menuContext.open);
  }, [menuContext]);

  return (
    <>
      <summary className={menuContext.open ? "modal-open" : ""}>
        <label>
          {label}
          <div className="text-wrapper">
            <input
              type="text"
              value={selectedItem}
              onClick={handleClick}
            ></input>
            <Icon icon="expand_more" />
          </div>
        </label>
      </summary>
    </>
  );
};
