import React, { ReactNode, useCallback, useContext } from "react";

import type {
  SelectMenuItemProps as PrimerSelectMenuItemProps,
  SelectMenuListProps as PrimerSelectMenuListProps,
  SelectMenuModalProps as PrimerSelectMenuModalProps,
  SelectMenuProps,
} from "@primer/react/deprecated";
import { SelectMenu as PrimerSelectMenu } from "@primer/react/deprecated";

import classNames from "classnames";
import SearchField, {
  Props as SearchFieldProps,
} from "../SearchField/SearchField";

import { Button, EnumButtonStyle, EnumIconPosition } from "../Button/Button";

import "./SelectMenu.scss";
import { Label } from "../Label/Label";

export interface Props extends Omit<SelectMenuProps, "title"> {
  buttonStyle?: EnumButtonStyle;
  buttonIconPosition?: EnumIconPosition;
  disabled?: boolean;
  title: string | React.ReactNode;
  icon?: string;
  openIcon?: string;
  buttonClassName?: string;
  selectRef?: React.Ref<HTMLDetailsElement> | undefined;
  hideSelectedItemsIndication?: boolean;
  buttonAsTextBox?: boolean;
  buttonAsTextBoxLabel?: string;
}

const SelectButton: React.FC<Props> = ({
  disabled,
  buttonStyle,
  buttonIconPosition = EnumIconPosition.Right,
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
      iconPosition={buttonIconPosition}
      icon={openIcon ? ((menuContext as any).open ? openIcon : icon) : icon}
      iconSize={"xsmall"}
    >
      {title}
    </Button>
  );
};

type SelectTextboxProps = {
  title: string | React.ReactNode;
  buttonClassName?: string;
  label?: string;
};

const SelectTextbox: React.FC<SelectTextboxProps> = ({
  title,
  buttonClassName,
  label,
}) => {
  const className = `select-menu__summary text-input  ${buttonClassName}`;
  return (
    <summary className={className}>
      <Label className="select-menu__textbox-label" text={label || ""} />
      <span className="select-menu__textbox">{title}</span>
    </summary>
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
  selectRef,
  hideSelectedItemsIndication = false,
  buttonIconPosition = EnumIconPosition.Right,
  buttonAsTextBox = false,
  buttonAsTextBoxLabel,
  ...rest
}: Props) => {
  if (disabled) {
    return (
      <div className={classNames("select-menu", className)}>
        <SelectButton
          disabled={disabled}
          buttonIconPosition={buttonIconPosition}
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
        className={classNames("select-menu", className, {
          "select-menu--hide-selected-item-indication":
            hideSelectedItemsIndication,
        })}
        {...(selectRef ? { ref: selectRef } : {})}
        {...rest}
      >
        {buttonAsTextBox ? (
          <SelectTextbox
            buttonClassName={buttonClassName}
            title={title}
            label={buttonAsTextBoxLabel}
          />
        ) : (
          <SelectButton
            disabled={disabled}
            buttonStyle={buttonStyle}
            buttonIconPosition={buttonIconPosition}
            buttonClassName={buttonClassName}
            icon={icon}
            openIcon={openIcon}
            title={title}
          />
        )}

        <SelectMenuChildren>{children}</SelectMenuChildren>
      </PrimerSelectMenu>
    );
};

type SelectMenuChildrenProps = {
  children: React.ReactNode;
};

export const SelectMenuChildren = ({ children }: SelectMenuChildrenProps) => {
  const menuContext = useContext(PrimerSelectMenu.MenuContext);
  const isOpen = menuContext.open;

  return <>{isOpen && children}</>;
};

export type SelectMenuModalProps = PrimerSelectMenuModalProps & {
  withCaret?: boolean;
};

export const SelectMenuModal: React.FC<SelectMenuModalProps> = ({
  withCaret = false,
  ...rest
}: SelectMenuModalProps) => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <PrimerSelectMenu.Modal
      className={classNames("select-menu__modal", rest.className, {
        "select-menu__modal--with-caret": withCaret,
      })}
      {...rest}
    >
      {rest.children}
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
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
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
