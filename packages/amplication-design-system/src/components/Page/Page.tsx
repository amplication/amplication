import React from "react";
import "./Page.scss";
import classNames from "classnames";

export type Props = {
  children: React.ReactNode;
  className?: string;
  withFloatingBar?: boolean;
};

function Page({ children, className, withFloatingBar = false }: Props) {
  return (
    <div
      className={classNames("amp-page", className, {
        "amp-page--with-floating-bar": withFloatingBar,
      })}
    >
      <main>{children}</main>
    </div>
  );
}

export default Page;
