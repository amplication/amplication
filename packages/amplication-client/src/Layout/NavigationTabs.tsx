import React, { useCallback, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import classNames from "classnames";
import NavigationTabsContext, {
  NavigationTabItem,
} from "./NavigationTabsContext";
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
          item={item}
          defaultTabUrl={defaultTabUrl}
          tabsCount={items.length}
        />
      ))}
    </div>
  );
};

type TabProps = {
  item: NavigationTabItem;
  defaultTabUrl: string;
  tabsCount: number;
};

const Tab = ({ item, defaultTabUrl, tabsCount }: TabProps) => {
  const history = useHistory();

  const navigationTabsContext = useContext(NavigationTabsContext);

  const handleCloseTab = useCallback(() => {
    const url = navigationTabsContext.unregisterItem(item.key);
    history.push(url || defaultTabUrl);
  }, [navigationTabsContext, item.key, history, defaultTabUrl]);

  const activeClass = `${CLASS_NAME}__tab--active`;

  return (
    <span
      className={classNames(`${CLASS_NAME}__tab`, {
        [activeClass]: item.active,
      })}
    >
      <Link to={item.url}>{item.name}</Link>
      <Button
        disabled={item.url === defaultTabUrl && tabsCount === 1}
        buttonStyle={EnumButtonStyle.Text}
        icon="close"
        iconSize="xsmall"
        onClick={handleCloseTab}
      />
    </span>
  );
};

NavigationTabs.Tab = Tab;

export default NavigationTabs;
