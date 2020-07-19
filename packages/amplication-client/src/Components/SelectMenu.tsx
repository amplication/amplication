import React from "react";
import {
  SelectMenu as PrimerSelectMenu,
  SelectMenuProps,
  SelectMenuModalProps as PrimerSelectMenuModalProps,
  SelectMenuItemProps as PrimerSelectMenuItemProps,
  SelectMenuListProps as PrimerSelectMenuListProps,
} from "@primer/components";
import classNames from "classnames";

import { Button, ButtonProps } from "./Button";

import "./SelectMenu.scss";

export type Props = SelectMenuProps &
  Omit<ButtonProps, "isSplit"> & {
    disabled?: boolean;
    title: string;
  };

export const SelectMenu = ({
  disabled = false,
  children,
  className,
  buttonStyle,
  title,
  ...rest
}: Props) => {
  if (disabled) {
    return (
      <div className={classNames("select-menu", className)}>
        <Button
          className="select-menu__summary"
          disabled
          buttonStyle={buttonStyle}
          isSplit
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
          isSplit
          className="select-menu__summary"
          buttonStyle={buttonStyle}
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
export type SelectMenuItemProps = PrimerSelectMenuItemProps;

export const SelectMenuItem = (props: SelectMenuItemProps) => {
  return (
    <PrimerSelectMenu.Item
      className={classNames("select-menu__item", props.className)}
      {...props}
    >
      {props.children}
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
