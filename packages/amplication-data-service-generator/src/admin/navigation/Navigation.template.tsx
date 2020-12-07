import React, { useCallback } from "react";
import { useHistory, Link } from "react-router-dom";
// @ts-ignore
import { removeCredentials } from "./auth";

declare const ITEMS: React.ReactElement[];

const Navigation = (): React.ReactElement => {
  return <ul>{ITEMS}</ul>;
};

export default Navigation;

const NavigationItem = ({
  to,
  name,
}: {
  to: string;
  name: string;
}): React.ReactElement => (
  <li>
    <Link to={to}>{name}</Link>
  </li>
);
