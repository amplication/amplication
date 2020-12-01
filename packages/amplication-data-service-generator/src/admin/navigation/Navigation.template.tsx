import React from "react";

declare const ITEMS: React.ReactElement[];

const Navigation = (): React.ReactElement => <ul>{ITEMS}</ul>;

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
