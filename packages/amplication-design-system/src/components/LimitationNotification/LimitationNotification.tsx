import React from "react";

import "./LimitationNotification.scss";

const CLASS_NAME = "limitation-notification";

export type Props = {
  children: React.ReactNode;
};

export const LimitationNotification = ({ children }: Props) => {
  return <div className={CLASS_NAME}>{children}</div>;
};
