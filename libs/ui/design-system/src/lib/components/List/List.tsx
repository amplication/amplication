import React, { ReactNode } from "react";
import classNames from "classnames";
import "./List.scss";

const CLASS_NAME = "amp-list";

export type Props = {
  className?: string;
  children: ReactNode;
};

export function List({ className, children }: Props) {
  return <div className={classNames(CLASS_NAME, className)}>{children}</div>;
}
