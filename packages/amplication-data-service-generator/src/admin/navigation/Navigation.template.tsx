import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
// @ts-ignore
import { removeCredentials } from "./auth";

declare const ITEMS: React.ReactElement[];

const Navigation = (): React.ReactElement => {
  const history = useHistory();
  const signOut = useCallback(() => {
    removeCredentials();
    history.push("/login");
  }, [history]);
  return (
    <ul>
      {ITEMS}
      <li>
        <button onClick={signOut}>Sign Out</button>
      </li>
    </ul>
  );
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
    <a href={to}>{name}</a>
  </li>
);
