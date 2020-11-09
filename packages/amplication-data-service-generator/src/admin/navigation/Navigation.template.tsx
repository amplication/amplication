import React from "react";

declare const ITEMS: React.ReactNode[];

const Navigation = () => <ul>{ITEMS}</ul>;

export default Navigation;

const NavigationItem = ({ to, name }: { to: string; name: string }) => (
  <a href={to}>{name}</a>
);
