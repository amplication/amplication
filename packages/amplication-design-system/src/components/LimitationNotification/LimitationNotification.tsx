import React from "react";
import { Link } from "react-router-dom";

import "./LimitationNotification.scss";

const LIMIT_CLASS_NAME = "limitation-notification";
const UPGRADE_LINK_CLASS_NAME = "upgrade-link";

export type Props = {
  description: string;
  link: string;
};

export const LimitationNotification = ({ description, link }: Props) => {
  return (
    <div className={LIMIT_CLASS_NAME}>
      <span>{description}</span>
      <Link
        className={UPGRADE_LINK_CLASS_NAME}
        to={{
          pathname: link,
          state: { from: { pathname: window.location.pathname } },
        }}
      >
        Upgrade now
      </Link>
    </div>
  );
};
