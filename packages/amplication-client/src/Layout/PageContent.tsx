import React from "react";
import "./PageContent.scss";
import classNames from "classnames";

type Props = {
  children: React.ReactNode;
  className?: string;
  withFloatingBar?: boolean;
};

function PageContent({ children, className, withFloatingBar = false }: Props) {
  return (
    <div
      className={classNames("amp-page-content", className, {
        "amp-page-content--with-bar": withFloatingBar,
      })}
    >
      {children}
    </div>
  );
}

export default PageContent;
