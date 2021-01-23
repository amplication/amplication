import React, { useCallback, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import classNames from "classnames";
import NavigationTabsContext from "./NavigationTabsContext";
import { Button, EnumButtonStyle } from "../Components/Button";

import "./NavigationTabs.scss";

const CLASS_NAME = "navigation-tabs";

type Props = {
  defaultTabUrl: string;
};

const NavigationTabs = ({ defaultTabUrl }: Props) => {
  const navigationTabsContext = useContext(NavigationTabsContext);

  return (
    <div className={CLASS_NAME}>
      {navigationTabsContext.items.map((item, index, items) => (
        <NavigationTabs.Tab
          key={index}
          to={item.url}
          text={item.name}
          active={item.active}
          defaultTabUrl={defaultTabUrl}
          tabsCount={items.length}
        />
      ))}
    </div>
  );
};

type TabProps = {
  to: string;
  text: string;
  active: boolean;
  defaultTabUrl: string;
  tabsCount: number;
};

const Tab = ({ to, text, active, defaultTabUrl, tabsCount }: TabProps) => {
  const history = useHistory();

  const navigationTabsContext = useContext(NavigationTabsContext);

  const handleCloseTab = useCallback(() => {
    const url = navigationTabsContext.unregisterItem(to);
    history.push(url || defaultTabUrl);
  }, [navigationTabsContext, to, history, defaultTabUrl]);

  const activeClass = `${CLASS_NAME}__tab--active`;

  return (
    <span
      className={classNames(`${CLASS_NAME}__tab`, { [activeClass]: active })}
    >
      <Link to={to}>{text}</Link>
      <Button
        disabled={to === defaultTabUrl && tabsCount === 1}
        buttonStyle={EnumButtonStyle.Clear}
        icon="close"
        onClick={handleCloseTab}
      />
    </span>
  );
};

NavigationTabs.Tab = Tab;

export default NavigationTabs;
