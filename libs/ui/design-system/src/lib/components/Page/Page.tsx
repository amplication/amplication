import React from "react";
import "./Page.scss";
import classNames from "classnames";

export type Props = {
  children: React.ReactNode;
  className?: string;
};

export const Page: React.FC<Props> = ({ children, className }) => {
  return (
    <div className={classNames("amp-page", className)}>
      <main>{children}</main>
    </div>
  );
};

export default Page;
