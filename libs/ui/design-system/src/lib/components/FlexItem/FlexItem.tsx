import React, { ReactNode } from "react";
import classNames from "classnames";
import "./FlexItem.scss";

export enum EnumFlexItemMargin {
  None = "none",
  Bottom = "bottom",
  Top = "top",
  Both = "both",
}

export enum EnumFlexItemContentDirection {
  Row = "row",
  Column = "column",
}

export enum EnumFlexItemContentAlign {
  Center = "center",
  Start = "flex-start",
  End = "flex-end",
}

export type Props = {
  className?: string;
  margin?: EnumFlexItemMargin;
  children?: ReactNode;
  start?: ReactNode;
  end?: ReactNode;
  contentDirection?: EnumFlexItemContentDirection;
  contentAlign?: EnumFlexItemContentAlign;
};

const CLASS_NAME = "amp-flex-item";

export const FlexItem = ({
  children,
  className,
  start,
  end,
  margin = EnumFlexItemMargin.None,
  contentDirection = EnumFlexItemContentDirection.Row,
  contentAlign = EnumFlexItemContentAlign.Start,
}: Props) => {
  const marginClass = getMarginStyle(margin);
  const directionClass = `${CLASS_NAME}--${contentDirection}`;

  return (
    <div
      className={classNames(CLASS_NAME, directionClass, marginClass, className)}
      style={{ justifyContent: contentAlign }}
    >
      {start && <FlexStart>{start}</FlexStart>}
      {React.Children.toArray(children).map((child, index) => {
        if (
          React.isValidElement(child) &&
          (child as React.ReactElement<any>).type === FlexStart
        ) {
          return child;
        } else if (
          React.isValidElement(child) &&
          (child as React.ReactElement<any>).type === FlexEnd
        ) {
          return <FlexStart>{child}</FlexStart>;
        } else {
          return child;
        }
      })}
      {end && <FlexEnd>{end}</FlexEnd>}
    </div>
  );
};

export type FlexStartProps = {
  className?: string;
  children?: ReactNode;
};

export const FlexStart = ({ children, className }: FlexStartProps) => {
  return (
    <div
      style={{ alignItems: "flex-start" }}
      className={classNames(`${CLASS_NAME}__start`, className)}
    >
      {children}
    </div>
  );
};

export type FlexEndProps = {
  className?: string;
  children?: ReactNode;
};

export const FlexEnd = ({ children, className }: FlexEndProps) => {
  return (
    <div
      style={{ alignItems: "flex-end" }}
      className={classNames(`${CLASS_NAME}__end`, className)}
    >
      {children}
    </div>
  );
};

export type FlexContentProps = {
  className?: string;
  children?: ReactNode;
  contentDirection?: EnumFlexItemContentDirection;
  contentAlign?: EnumFlexItemContentAlign;
};

export const FlexContent = ({
  children,
  className,
  contentAlign = EnumFlexItemContentAlign.Start,
  contentDirection = EnumFlexItemContentDirection.Column,
}: FlexContentProps) => {
  const directionClass = `${CLASS_NAME}--${contentDirection}`;

  return (
    <div
      className={classNames(
        `${CLASS_NAME}__content`,
        directionClass,
        className
      )}
      style={{ justifyContent: contentAlign }}
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
