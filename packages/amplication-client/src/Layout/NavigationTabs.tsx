import React, { useContext } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import NavigationTabsContext from "./NavigationTabsContext";

import "./NavigationTabs.scss";

const CLASS_NAME = "navigation-tabs";

type Props = {
  children: React.ReactNode;
};

const NavigationTabs = ({ children }: Props) => {
  const navigationTabsContext = useContext(NavigationTabsContext);

  return (
    <div className={CLASS_NAME}>
      {navigationTabsContext.items.map((item, index, items) => (
        <NavigationTabs.Tab
          key={index}
          to={item.url}
          text={item.name}
          active={item.active}
        />
      ))}
    </div>
  );
};

type TabProps = {
  to: string;
  text: string;
  active: boolean;
};

const Tab = ({ to, text, active }: TabProps) => {
  const activeClass = `${CLASS_NAME}__tab--active`;
  return (
    <Link
      className={classNames(`${CLASS_NAME}__tab`, { [activeClass]: active })}
      to={to}
    >
      {text}
    </Link>
  );
};

NavigationTabs.Tab = Tab;

export default NavigationTabs;
