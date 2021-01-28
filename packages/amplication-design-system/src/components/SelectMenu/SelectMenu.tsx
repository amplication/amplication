import React, { useCallback } from "react";
import {
  SelectMenu as PrimerSelectMenu,
  SelectMenuProps,
  SelectMenuModalProps as PrimerSelectMenuModalProps,
  SelectMenuItemProps as PrimerSelectMenuItemProps,
  SelectMenuListProps as PrimerSelectMenuListProps,
} from "@primer/components";
import classNames from "classnames";
import SearchField, {
  Props as SearchFieldProps,
} from "../SearchField/SearchField";

import { Button, EnumButtonStyle } from "../Button/Button";

import "./SelectMenu.scss";

export type Props = SelectMenuProps & {
  buttonStyle?: EnumButtonStyle;
  disabled?: boolean;
  title: string;
  icon?: string;
};

export const SelectMenu = ({
  disabled = false,
  children,
  className,
  buttonStyle,
  title,
  icon,
  ...rest
}: Props) => {
  if (disabled) {
    return (
      <div className={classNames("select-menu", className)}>
        <Button
          className="select-menu__summary"
          disabled
          buttonStyle={buttonStyle}
          icon={icon}
        >
          {title}
        </Button>
      </div>
    );
  } else
    return (
      <PrimerSelectMenu
        className={classNames("select-menu", className)}
        {...rest}
      >
        <Button
          as="summary"
          className="select-menu__summary"
          buttonStyle={buttonStyle}
          icon={icon}
        >
          {title}
        </Button>
        {children}
      </PrimerSelectMenu>
    );
};

export type SelectMenuModalProps = PrimerSelectMenuModalProps;

export const SelectMenuModal = (props: SelectMenuModalProps) => {
  return (
    <PrimerSelectMenu.Modal
      className={classNames("select-menu__modal", props.className)}
      {...props}
    >
      {props.children}
    </PrimerSelectMenu.Modal>
  );
};
export type SelectMenuItemProps = PrimerSelectMenuItemProps & {
  onSelectionChange?: (itemData: any) => void;
  itemData?: any;
  closeAfterSelectionChange?: boolean;
};

export const SelectMenuItem = ({
  selected,
  onSelectionChange,
  itemData,
  closeAfterSelectionChange = false,
  ...rest
}: SelectMenuItemProps) => {
  const handleClick = useCallback(
    (e) => {
      if (onSelectionChange) {
        onSelectionChange(itemData);
        if (!closeAfterSelectionChange) {
          e.preventDefault();
        }
      }
    },
    [itemData, onSelectionChange, closeAfterSelectionChange]
  );

  return (
    <PrimerSelectMenu.Item
      className={classNames("select-menu__item", rest.className, {
        "select-menu__item--selected": selected,
      })}
      {...rest}
      selected={selected}
      onClick={handleClick}
    >
      {rest.children}
    </PrimerSelectMenu.Item>
  );
};

export type SelectMenuListProps = PrimerSelectMenuListProps;

export const SelectMenuList = (props: SelectMenuListProps) => {
  return (
    <PrimerSelectMenu.List
      className={classNames("select-menu__list", props.className)}
      {...props}
    >
      {props.children}
    </PrimerSelectMenu.List>
  );
};

export type SelectMenuFilterProps = SearchFieldProps;

export const SelectMenuFilter = (props: SelectMenuFilterProps) => {
  return (
    <div className="select-menu__filter">
      <SearchField {...props} />
    </div>
  );
};
