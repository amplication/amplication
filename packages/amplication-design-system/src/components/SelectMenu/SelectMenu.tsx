import React, { useCallback, useContext } from "react";
import {
  SelectMenu as PrimerSelectMenu,
  SelectMenuProps,
  SelectMenuModalProps as PrimerSelectMenuModalProps,
  SelectMenuItemProps as PrimerSelectMenuItemProps,
  SelectMenuListProps as PrimerSelectMenuListProps,
} from "@primer/react";
import classNames from "classnames";
import SearchField, {
  Props as SearchFieldProps,
} from "../SearchField/SearchField";

import { Button, EnumButtonStyle } from "../Button/Button";

import "./SelectMenu.scss";

interface ButtonProps {
  buttonStyle?: EnumButtonStyle;
  disabled?: boolean;
  title: string | Element;
  icon?: string;
  openIcon?: string;
  buttonClassName?: string;
}

export type Props = SelectMenuProps & ButtonProps;

const SelectButton: React.FC<ButtonProps> = ({
  disabled,
  buttonStyle,
  title,
  icon,
  openIcon,
  buttonClassName,
}) => {
  const menuContext = useContext(PrimerSelectMenu.MenuContext);
  const className = `select-menu__summary ${buttonClassName}`;
  return (
    <Button
      {...(disabled ? { disabled } : { as: "summary" })}
      className={className}
      buttonStyle={buttonStyle}
      icon={openIcon ? (menuContext.open ? openIcon : icon) : icon}
      iconSize={"xsmall"}
    >
      {title}
    </Button>
  );
};

export const SelectMenu = ({
  disabled = false,
  children,
  className,
  buttonStyle,
  buttonClassName,
  title,
  icon,
  openIcon,
  ...rest
}: Props) => {
  if (disabled) {
    return (
      <div className={classNames("select-menu", className)}>
        <SelectButton
          disabled={disabled}
          buttonStyle={buttonStyle}
          buttonClassName={buttonClassName}
          icon={icon}
          openIcon={openIcon}
          title={title}
        />
      </div>
    );
  } else
    return (
      <PrimerSelectMenu
        className={classNames("select-menu", className)}
        {...rest}
      >
        <SelectButton
          disabled={disabled}
          buttonStyle={buttonStyle}
          buttonClassName={buttonClassName}
          icon={icon}
          openIcon={openIcon}
          title={title}
        />
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
