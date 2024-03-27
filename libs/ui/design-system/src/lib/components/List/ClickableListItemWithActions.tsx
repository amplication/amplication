import classNames from "classnames";
import { isEmpty } from "lodash";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  FlexItem,
} from "../..";
import { FlexEnd, FlexStart } from "../FlexItem/FlexItem";
import "./List.scss";

const CLASS_NAME = "amp-list-item-with-inner-actions";

export type Props = {
  className?: string;
  children: ReactNode;
  to?: string;
  onClick?: (event: any) => void;
  startAction?: ReactNode;
  endAction?: ReactNode;
};

export function ClickableListItemWithInnerActions(props: Props) {
  const { className, children, to, onClick, startAction, endAction } = props;

  const Element = !isEmpty(to) ? NavLink : "div";
  const clickable = !isEmpty(to) || !!onClick;

  return (
    <FlexItem
      className={classNames(CLASS_NAME, className)}
      contentAlign={EnumContentAlign.Start}
      itemsAlign={EnumItemsAlign.Center}
      gap={EnumGapSize.None}
    >
      {startAction && (
        <FlexStart className={`${CLASS_NAME}__start_action`}>
          {startAction}
        </FlexStart>
      )}
      <Element
        to={to}
        onClick={onClick}
        role={clickable ? "button" : undefined}
        className={classNames(`${CLASS_NAME}__clickable-area`, {
          [`${CLASS_NAME}__clickable-area--with-start`]: !!startAction,
          [`${CLASS_NAME}__clickable-area--with-end`]: !!endAction,
        })}
      >
        <FlexItem
          direction={EnumFlexDirection.Row}
          contentAlign={EnumContentAlign.Start}
          itemsAlign={EnumItemsAlign.Center}
          gap={EnumGapSize.Default}
        >
          {children}
        </FlexItem>
      </Element>
      {endAction && (
        <FlexEnd className={`${CLASS_NAME}__end_action`}>{endAction}</FlexEnd>
      )}
    </FlexItem>
  );
}
