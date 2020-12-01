import React from "react";

declare const ITEMS: React.ReactNode[];

const Navigation = (): React.ReactNode => <ul>{ITEMS}</ul>;

export default Navigation;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NavigationItem = ({
  to,
  name,
}: {
  to: string;
  name: string;
}): React.ReactNode => (
  <li>
    <a href={to}>{name}</a>
  </li>
);
