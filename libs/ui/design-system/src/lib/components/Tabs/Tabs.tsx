import {
  Tab as MuiTab,
  TabProps as MuiTabProps,
  Tabs as MuiTabs,
  TabsProps as MuiTabsProps,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./Tabs.scss";
import { useState } from "react";

export type Props = MuiTabsProps;

export const Tabs = ({ children }: Props) => {
  const [value, setValue] = useState(0);

  return (
    <MuiTabs
      value={value}
      className="amp-tabs"
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
    >
      {children}
    </MuiTabs>
  );
};

export default Tabs;

export type TabProps = MuiTabProps & {
  to: string;
};

function Tab(props: TabProps) {
  const { to, ...rest } = props;

  return (
    <MuiTab
      className="amp-tab"
      component={Link}
      classes={{ selected: "amp-tab--selected" }}
      to={to}
      disableRipple
      {...rest}
    />
  );
}

Tabs.Tab = Tab;
