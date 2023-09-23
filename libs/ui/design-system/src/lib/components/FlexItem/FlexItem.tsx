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

export type Props = {
  className?: string;
  margin?: EnumFlexItemMargin;
  children?: ReactNode;
  near?: ReactNode;
  far?: ReactNode;
  contentDirection?: EnumFlexItemContentDirection;
};

const CLASS_NAME = "amp-flex-item";

export const FlexItem = ({
  children,
  className,
  near,
  far,
  margin = EnumFlexItemMargin.None,
  contentDirection = EnumFlexItemContentDirection.Column,
}: Props) => {
  const marginClass = margin ? `${CLASS_NAME}--margin-${margin}` : undefined;

  return (
    <div className={classNames(CLASS_NAME, marginClass, className)}>
      {near && <div className={`${CLASS_NAME}__near`}>{near}</div>}
      {children && (
        <div
          className={classNames(
            `${CLASS_NAME}__content`,
            `${CLASS_NAME}__content--${contentDirection}`
          )}
        >
          {children}
        </div>
      )}
      {far && <div className={`${CLASS_NAME}__far`}>{far}</div>}
    </div>
  );
};
