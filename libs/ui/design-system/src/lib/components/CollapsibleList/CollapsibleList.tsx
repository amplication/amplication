import classNames from "classnames";
import { ReactNode } from "react";
import "./CollapsibleList.scss";

const CLASS_NAME = "amp-collapsible-list";

export type Props = {
  className?: string;
  children: ReactNode;
};

export function CollapsibleList({ className, children }: Props) {
  return <div className={classNames(CLASS_NAME, className)}>{children}</div>;
}
