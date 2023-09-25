import React, { ReactNode, CSSProperties } from "react";
import classNames from "classnames";
import "./List.scss";
import { EnumFlexDirection, FlexItem, FlexItemProps, Icon } from "../..";
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
    contentAlign: itemsAlign,
    margin,
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
      })}
      to={to}
      {...rest}
    >
      <FlexItem
        margin={margin}
        start={start}
        end={showDefaultActionIcon ? defaultActionIcon : end}
      >
        <FlexItem direction={direction} contentAlign={itemsAlign}>
          {children}
        </FlexItem>
      </FlexItem>
    </Element>
  );
}
