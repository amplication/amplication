import React, { ReactNode } from "react";
import classNames from "classnames";
import "./FlexItem.scss";

export type Props = {
  className?: string;
  children: ReactNode;
  near?: ReactNode;
  far?: ReactNode;
};

const CLASS_NAME = "amp-flex-item";

export const FlexItem = ({ children, className, near, far }: Props) => {
  return (
    <div className={classNames(CLASS_NAME, className)}>
      {near && <div className={`${CLASS_NAME}__near`}>{near}</div>}
      <div className={`${CLASS_NAME}__content`}>{children}</div>
      {far && <div className={`${CLASS_NAME}__far`}>{far}</div>}
    </div>
  );
};
