import classNames from "classnames";
import { ReactNode } from "react";
import "./VerticalNavigation.scss";

const CLASS_NAME = "amp-vertical-navigation";

export type Props = {
  className?: string;
  children: ReactNode;
};

export function VerticalNavigation({ className, children }: Props) {
  return <div className={classNames(CLASS_NAME, className)}>{children}</div>;
}
