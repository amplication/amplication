import React, { ReactNode, CSSProperties } from "react";
import classNames from "classnames";
import "./List.scss";
import { FlexItem, FlexItemProps, Icon } from "../..";
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
    near,
    far,
    className,
    children,
    style,
    to,
    onClick,
    showDefaultActionIcon,
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
        near={near}
        far={showDefaultActionIcon ? defaultActionIcon : far}
      >
        {children}
      </FlexItem>
    </Element>
  );
}
