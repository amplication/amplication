import React from "react";
import "./NavigationHeader.scss";

export type Props = {
  children: React.ReactNode;
};

const CLASS_NAME = "amp-navigation-header";

export const NavigationHeader = ({ children }: Props) => {
  return <div className={CLASS_NAME}>{children}</div>;
};
