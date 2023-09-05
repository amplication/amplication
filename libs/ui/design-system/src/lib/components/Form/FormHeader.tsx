import React from "react";

import "./FormHeader.scss";

const CLASS_NAME = "amp-form-header";
export type Props = {
  title?: string;
  children?: React.ReactNode;
};

export const FormHeader: React.FC<Props> = ({ title, children }) => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__strip`}>
        <h1 className={`${CLASS_NAME}__title`}>{title}</h1>
        <div className={`${CLASS_NAME}__controls`}>{children}</div>
      </div>
    </div>
  );
};
