import {
  Tab as MuiTab,
  TabProps as MuiTabProps,
  Tabs as MuiTabs,
  TabsProps as MuiTabsProps,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import "./Tabs.scss";

export type Props = MuiTabsProps;

export const Tabs = ({ children }: Props) => {
  return (
    <MuiTabs value={false} className="amp-tabs">
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
      component={NavLink}
      to={to}
      disableRipple
      {...rest}
    />
  );
}

Tabs.Tab = Tab;
