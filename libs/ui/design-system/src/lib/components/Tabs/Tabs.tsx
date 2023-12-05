import {
  Tab as MuiTab,
  TabProps as MuiTabProps,
  Tabs as MuiTabs,
  TabsProps as MuiTabsProps,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import "./Tabs.scss";
import { EnumTextColor } from "../Text/Text";
import React from "react";

export type Props = MuiTabsProps;

export const Tabs = ({ children }: Props) => {
  return (
    <MuiTabs value={false} className="amp-tabs">
      {children}
    </MuiTabs>
  );
};

export default Tabs;

export type TabItem = {
  name: string;
  to: string;
  exact: boolean;
  featureTab?: boolean;
  featureIndicator?: React.ReactNode;
  iconName?: string;
  indicatorValue?: string | number;
  indicatorColor?: EnumTextColor;
  disabled?: boolean;
};

export type TabProps = Omit<MuiTabProps, "label"> & TabItem;

function Tab(props: TabProps) {
  const {
    to,
    exact,
    iconName,
    featureTab = false,
    featureIndicator,
    name,
    indicatorColor,
    indicatorValue,
    disabled,
    ...rest
  } = props;

  const colorStyle = indicatorColor && {
    backgroundColor: `var(--${indicatorColor})`,
  };

  const label = (
    <>
      {name}
      {indicatorValue && (
        <span style={colorStyle} className="amp-tab__indicator">
          {indicatorValue}
        </span>
      )}
      {featureTab && (
        <span className="amp-tab__indicator">{featureIndicator}</span>
      )}
    </>
  );

  return (
    <MuiTab
      className="amp-tab"
      component={NavLink}
      classes={{ selected: "amp-tab--selected" }}
      // icon={iconName && <Icon size={"small"} icon={iconName} />}
      to={!disabled ? to : {}}
      label={label}
      disableRipple
      {...rest}
      exact={exact}
    />
  );
}

Tabs.Tab = Tab;
