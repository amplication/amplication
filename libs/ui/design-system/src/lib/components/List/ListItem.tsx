import React, { ReactNode, CSSProperties } from "react";
import classNames from "classnames";
import "./List.scss";
import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  FlexItem,
  FlexItemProps,
  Icon,
} from "../..";
import { NavLink } from "react-router-dom";
import { isEmpty } from "lodash";

const CLASS_NAME = "amp-list-item";

const defaultActionIcon = <Icon icon="chevron_right"></Icon>;

export type Props = {
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
  to?: string;
  showDefaultActionIcon?: boolean;
  onClick?: (event: any) => void;
  removeDefaultPadding?: boolean;
} & FlexItemProps;

export function ListItem(props: Props) {
  const {
    start,
    end,
    className,
    children,
    style,
    to,
    onClick,
    showDefaultActionIcon,
    direction = EnumFlexDirection.Column,
    contentAlign = EnumContentAlign.Start,
    itemsAlign = EnumItemsAlign.Start,
    gap = EnumGapSize.Small,
    margin,
    removeDefaultPadding = false,

    ...rest
  } = props;

  const Element = !isEmpty(to) ? NavLink : "div";
  const clickable = !isEmpty(to) || !!onClick;

  return (
    <Element
      onClick={onClick}
      style={style}
      role={clickable ? "button" : undefined}
      className={classNames(CLASS_NAME, className, {
        [`${CLASS_NAME}--clickable`]: clickable,
        [`${CLASS_NAME}--no-padding`]: removeDefaultPadding,
      })}
      to={to}
      {...rest}
    >
      <FlexItem
        margin={margin}
        start={start}
        end={showDefaultActionIcon ? defaultActionIcon : end}
        contentAlign={EnumContentAlign.Center}
        itemsAlign={EnumItemsAlign.Center}
      >
        <FlexItem
          direction={direction}
          contentAlign={contentAlign}
          itemsAlign={itemsAlign}
          gap={gap}
        >
          {children}
        </FlexItem>
      </FlexItem>
    </Element>
  );
}
