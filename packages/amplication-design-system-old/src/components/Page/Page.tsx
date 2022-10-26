import React from "react";
import "./Page.scss";
import classNames from "classnames";

export type Props = {
  children: React.ReactNode;
  className?: string;
};

function Page({ children, className }: Props) {
  return (
    <div className={classNames("amp-page", className)}>
      <main>{children}</main>
    </div>
  );
}

export default Page;
