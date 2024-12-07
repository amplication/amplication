import React from "react";

import "./FormColumns.scss";

export type Props = {
  children: React.ReactNode;
};

const CLASS_NAME = "amp-form-columns";

export const FormColumns = ({ children }: Props) => {
  return <div className={CLASS_NAME}>{children}</div>;
};
