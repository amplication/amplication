import React, { ReactNode } from "react";
import classNames from "classnames";
import "./FlexItem.scss";

export enum EnumFlexItemMargin {
  None = "none",
  Bottom = "bottom",
  Top = "top",
  Both = "both",
}

export enum EnumGapSize {
  None = "none",
  Small = "small",
  Default = "default",
  Large = "large",
  XLarge = "xlarge",
}

export enum EnumFlexDirection {
  Row = "row",
  Column = "column",
}

export enum EnumContentAlign {
  Center = "center",
  Start = "flex-start",
  End = "flex-end",
  Space = "space-between",
}

export enum EnumItemsAlign {
  Center = "center",
  Start = "flex-start",
  End = "flex-end",
  Stretch = "stretch",
  Normal = "normal",
}

export type Props = {
  className?: string;
  margin?: EnumFlexItemMargin;
  children?: ReactNode;
  start?: ReactNode;
  end?: ReactNode;
  direction?: EnumFlexDirection;
  contentAlign?: EnumContentAlign;
  itemsAlign?: EnumItemsAlign;
  gap?: EnumGapSize;
  wrap?: boolean;
  singeChildWithEllipsis?: boolean;
};

const CLASS_NAME = "amp-flex-item";

export const FlexItem = ({
  children,
  className,
  start,
  end,
  margin = EnumFlexItemMargin.None,
  direction = EnumFlexDirection.Row,
  contentAlign = EnumContentAlign.Start,
  itemsAlign = EnumItemsAlign.Start,
  gap = EnumGapSize.Default,
  wrap = false,
  singeChildWithEllipsis = false,
}: Props) => {
  const marginClass = getMarginStyle(margin);
  const directionClass = `${CLASS_NAME}--${direction}`;
  const gapClass = gap ? `${CLASS_NAME}--gap-${gap}` : undefined;

  return (
    <div
      className={classNames(
        CLASS_NAME,
        directionClass,
        marginClass,
        gapClass,
        className
      )}
      style={{
        justifyContent: contentAlign,
        alignItems: itemsAlign,
        flexWrap: wrap ? "wrap" : undefined,
      }}
    >
      {start && <FlexStart>{start}</FlexStart>}
      {singeChildWithEllipsis ? (
        <div className={`${CLASS_NAME}__singe-child-with-ellipsis`}>
          {children}
        </div>
      ) : (
        children
      )}
      {end && <FlexEnd>{end}</FlexEnd>}
    </div>
  );
};

export type FlexStartProps = {
  className?: string;
  children?: ReactNode;
  alignSelf?: EnumContentAlign;
  minWidthAuto?: boolean;
  direction?: EnumFlexDirection;
};

export const FlexStart = ({
  children,
  className,
  alignSelf,
  direction = EnumFlexDirection.Column,
  minWidthAuto = false,
}: FlexStartProps) => {
  return (
    <div
      style={{
        alignSelf: alignSelf,
        minWidth: minWidthAuto ? "auto" : undefined,
        flexDirection: direction,
      }}
      className={classNames(`${CLASS_NAME}__start`, className)}
    >
      {children}
    </div>
  );
};

export type FlexEndProps = {
  className?: string;
  children?: ReactNode;
  alignSelf?: EnumContentAlign;
  minWidthAuto?: boolean;
  direction?: EnumFlexDirection;
};

export const FlexEnd = ({
  children,
  className,
  alignSelf,
  direction = EnumFlexDirection.Column,
  minWidthAuto = false,
}: FlexEndProps) => {
  return (
    <div
      style={{
        alignSelf: alignSelf,
        minWidth: minWidthAuto ? "auto" : undefined,
        flexDirection: direction,
      }}
      className={classNames(`${CLASS_NAME}__end`, className)}
    >
      {children}
    </div>
  );
};

function getMarginStyle(margin: EnumFlexItemMargin) {
  return margin ? `${CLASS_NAME}--margin-${margin}` : undefined;
}

FlexItem.FlexStart = FlexStart;
FlexItem.FlexEnd = FlexEnd;
