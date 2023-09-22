import React from "react";
import {
  Tabs as MuiTabs,
  TabsProps as MuiTabsProps,
  Tab as MuiTab,
  TabProps as MuiTabProps,
} from "@mui/material";
import "./Tabs.scss";
import { NavLink } from "react-router-dom";

export type Props = MuiTabsProps;

export const Tabs = ({ children }: Props) => {
  return <MuiTabs className="amp-tabs">{children}</MuiTabs>;
};

export default Tabs;

export type TabProps = MuiTabProps & {
  to: string;
};

function Tab(props: TabProps) {
  return <MuiTab component={NavLink} {...props} />;
}

Tabs.Tab = Tab;
